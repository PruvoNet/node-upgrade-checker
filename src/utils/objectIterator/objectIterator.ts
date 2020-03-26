export interface IRootNode {
  value: any;
}

export interface INode extends IRootNode {
  parent: IParent;
  key: string;
  depth: number;
}

export type IParent = INode | IRootNode;
export type ObjectIterator = Generator<INode, void, boolean | undefined>;
export type NodeSorter = (a: INode, b: INode) => number;

export const keySorter: NodeSorter = (a: INode, b: INode) => {
  return a.key.localeCompare(b.key);
};

export function* objectIterator(obj: any, sorter?: NodeSorter): ObjectIterator {
  yield* iterator({ value: obj }, obj, 0, sorter || keySorter, new Set<any>());
}

function* iterator(parent: IParent, obj: any, depth: number, sorter: NodeSorter, cache: Set<any>): ObjectIterator {
  if (!isObject(obj) || cache.has(obj)) {
    return;
  }
  cache.add(obj);
  const nextDepth = depth + 1;
  const nodes = Object.keys(obj).map((key) => {
    const value = obj[key];
    return { key, value, depth, parent };
  });
  nodes.sort(sorter);
  for (const node of nodes) {
    if (!(yield node)) {
      yield* iterator(node, node.value, nextDepth, sorter, cache);
    }
  }
}

const isObject = (obj: any): obj is Record<string, any> => {
  return obj !== null && typeof obj === `object`;
};
