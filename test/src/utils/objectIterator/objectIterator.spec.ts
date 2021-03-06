import { INode, keySorter, NodeSorter, objectIterator } from '../../../../src/utils/objectIterator/objectIterator';

describe(`object iterator`, () => {
  describe(`handled circular references`, () => {
    it(`Should not get stuck on circular references`, () => {
      const obj: any = { a: 1, b: { c: 2, d: {} } };
      obj.b.d.cir = obj.b;
      const results: INode[] = [];
      for (const node of objectIterator(obj)) {
        delete node.parent;
        results.push(node);
      }
      expect(results).toEqual([
        { key: `a`, value: 1, depth: 0, isLeaf: true, isNonRootNode: true },
        { key: `b`, value: obj.b, depth: 0, isLeaf: false, isNonRootNode: true },
        { key: `c`, value: 2, depth: 1, isLeaf: true, isNonRootNode: true },
        { key: `d`, value: obj.b.d, depth: 1, isLeaf: false, isNonRootNode: true },
        { key: `cir`, value: obj.b, depth: 2, isLeaf: false, isNonRootNode: true },
      ]);
    });
  });
  describe(`for of`, () => {
    it(`Should iterate simple object`, () => {
      const obj = { d: `7`, a: 1, b: { c: 2 } };
      const results: INode[] = [];
      for (const node of objectIterator(obj)) {
        results.push(node);
      }
      expect(results).toEqual([
        {
          key: `a`,
          value: 1,
          depth: 0,
          isLeaf: true,
          isNonRootNode: true,
          parent: { value: { a: 1, b: { c: 2 }, d: `7` }, isNonRootNode: false },
        },
        {
          key: `b`,
          value: { c: 2 },
          depth: 0,
          isLeaf: false,
          isNonRootNode: true,
          parent: { value: { a: 1, b: { c: 2 }, d: `7` }, isNonRootNode: false },
        },
        {
          key: `c`,
          value: 2,
          depth: 1,
          isLeaf: true,
          isNonRootNode: true,
          parent: {
            key: `b`,
            value: { c: 2 },
            depth: 0,
            isLeaf: false,
            isNonRootNode: true,
            parent: { value: { a: 1, b: { c: 2 }, d: `7` }, isNonRootNode: false },
          },
        },
        {
          key: `d`,
          value: `7`,
          depth: 0,
          isLeaf: true,
          isNonRootNode: true,
          parent: { value: { a: 1, b: { c: 2 }, d: `7` }, isNonRootNode: false },
        },
      ]);
    });

    it(`Should iterate complex object`, () => {
      const obj = { a: 1, b: { c: 2, d: { e: `5`, f: [1, `26`] } }, g: `7` };
      const results: INode[] = [];
      for (const node of objectIterator(obj)) {
        results.push(node);
      }
      expect(results).toMatchSnapshot();
    });
  });
  describe(`skip logic`, () => {
    it(`Should iterate simple object`, () => {
      const obj = { a: 1, b: { c: 2 }, d: `7` };
      const results: INode[] = [];
      const it = objectIterator(obj);
      let result = it.next();
      while (!result.done) {
        const { value: node } = result;
        results.push(node);
        result = it.next(node.key === `b`);
      }
      expect(results).toEqual([
        {
          key: `a`,
          value: 1,
          depth: 0,
          isLeaf: true,
          isNonRootNode: true,
          parent: { value: { a: 1, b: { c: 2 }, d: `7` }, isNonRootNode: false },
        },
        {
          key: `b`,
          value: { c: 2 },
          depth: 0,
          isLeaf: false,
          isNonRootNode: true,
          parent: { value: { a: 1, b: { c: 2 }, d: `7` }, isNonRootNode: false },
        },
        {
          key: `d`,
          value: `7`,
          depth: 0,
          isLeaf: true,
          isNonRootNode: true,
          parent: { value: { a: 1, b: { c: 2 }, d: `7` }, isNonRootNode: false },
        },
      ]);
    });

    it(`Should iterate complex object`, () => {
      const obj = { a: 1, b: { c: 2, d: { e: `5`, f: [1, `26`] } }, g: `7` };
      const results: INode[] = [];
      const it = objectIterator(obj);
      let result = it.next();
      while (!result.done) {
        const { value: node } = result;
        results.push(node);
        result = it.next(node.key === `d`);
      }
      expect(results).toMatchSnapshot();
    });
  });
  describe(`skip logic with custom sorter`, () => {
    it(`Should iterate object with skip logic with custom sorter`, () => {
      const obj = { a: 1, b: { c: 2 }, d: { a: 1, b: 2 } };
      const sorter: NodeSorter = (a: INode, b: INode) => {
        if (a.key === `b` && a.depth === 0) {
          return -1;
        } else if (b.key === `b` && b.depth === 0) {
          return 1;
        }
        return keySorter(a, b);
      };
      const results: INode[] = [];
      const it = objectIterator(obj, sorter);
      let result = it.next();
      while (!result.done) {
        const { value: node } = result;
        results.push(node);
        result = it.next(node.key === `b`);
      }
      expect(results).toEqual([
        {
          key: `b`,
          value: { c: 2 },
          depth: 0,
          isLeaf: false,
          isNonRootNode: true,
          parent: { value: { a: 1, b: { c: 2 }, d: { a: 1, b: 2 } }, isNonRootNode: false },
        },
        {
          key: `a`,
          value: 1,
          depth: 0,
          isLeaf: true,
          isNonRootNode: true,
          parent: { value: { a: 1, b: { c: 2 }, d: { a: 1, b: 2 } }, isNonRootNode: false },
        },
        {
          key: `d`,
          value: { a: 1, b: 2 },
          depth: 0,
          isLeaf: false,
          isNonRootNode: true,
          parent: { value: { a: 1, b: { c: 2 }, d: { a: 1, b: 2 } }, isNonRootNode: false },
        },
        {
          key: `a`,
          value: 1,
          depth: 1,
          isLeaf: true,
          isNonRootNode: true,
          parent: {
            key: `d`,
            value: { a: 1, b: 2 },
            depth: 0,
            isLeaf: false,
            isNonRootNode: true,
            parent: { value: { a: 1, b: { c: 2 }, d: { a: 1, b: 2 } }, isNonRootNode: false },
          },
        },
        {
          key: `b`,
          value: 2,
          depth: 1,
          isLeaf: true,
          isNonRootNode: true,
          parent: {
            key: `d`,
            value: { a: 1, b: 2 },
            depth: 0,
            isLeaf: false,
            isNonRootNode: true,
            parent: { value: { a: 1, b: { c: 2 }, d: { a: 1, b: 2 } }, isNonRootNode: false },
          },
        },
      ]);
    });
  });
});
