import { INode, objectIterator } from '../../../../src/utils/objectIterator/objectIterator';

describe(`object iterator`, () => {
  describe(`for of`, () => {
    it(`Should iterate simple object`, () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
        },
        d: `7`,
      };

      const results: INode[] = [];
      for (const node of objectIterator(obj)) {
        results.push(node);
      }
      expect(results).toEqual([
        {
          key: `a`,
          value: 1,
          depth: 0,
          parent: { value: { a: 1, b: { c: 2 }, d: `7` } },
        },
        {
          key: `b`,
          value: { c: 2 },
          depth: 0,
          parent: { value: { a: 1, b: { c: 2 }, d: `7` } },
        },
        {
          key: `c`,
          value: 2,
          depth: 1,
          parent: { key: `b`, value: { c: 2 }, depth: 0, parent: { value: { a: 1, b: { c: 2 }, d: `7` } } },
        },
        { key: `d`, value: `7`, depth: 0, parent: { value: { a: 1, b: { c: 2 }, d: `7` } } },
      ]);
    });

    it(`Should iterate complex object`, () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: `5`,
            f: [1, `26`],
          },
        },
        g: `7`,
      };

      const results: INode[] = [];
      for (const node of objectIterator(obj)) {
        results.push(node);
      }
      expect(results).toMatchSnapshot();
    });
  });
  describe(`skip logic`, () => {
    it(`Should iterate simple object`, () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
        },
        d: `7`,
      };
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
          parent: { value: { a: 1, b: { c: 2 }, d: `7` } },
        },
        {
          key: `b`,
          value: { c: 2 },
          depth: 0,
          parent: { value: { a: 1, b: { c: 2 }, d: `7` } },
        },
        { key: `d`, value: `7`, depth: 0, parent: { value: { a: 1, b: { c: 2 }, d: `7` } } },
      ]);
    });

    it(`Should iterate complex object`, () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: `5`,
            f: [1, `26`],
          },
        },
        g: `7`,
      };
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
});
