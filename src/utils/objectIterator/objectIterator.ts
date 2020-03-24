export interface IBaseNode {
  value: any;
}

export interface IRootNode extends IBaseNode {
  isNonRootNode: false;
}

export interface INode extends IBaseNode {
  parent: IParent;
  key: string;
  depth: number;
  isLeaf: boolean;
  isNonRootNode: true;
}

export type IParent = INode | IRootNode;
export type ObjectIterator = Generator<INode, void, boolean | undefined>;
export type NodeSorter = (a: INode, b: INode) => number;

export const keySorter: NodeSorter = (a: INode, b: INode) => {
  return a.key.localeCompare(b.key);
};

export function* objectIterator(obj: any, sorter?: NodeSorter): ObjectIterator {
  yield* iterator({ value: obj, isNonRootNode: false }, obj, 0, sorter || keySorter, new Set<any>());
}

function* iterator(parent: IParent, obj: any, depth: number, sorter: NodeSorter, cache: Set<any>): ObjectIterator {
  if (cache.has(obj)) {
    return;
  }
  cache.add(obj);
  const nextDepth = depth + 1;
  const nodes: INode[] = Object.keys(obj).map((key) => {
    const value = obj[key];
    const isLeaf = !isObject(value);
    return { key, value, depth, parent, isLeaf, isNonRootNode: true };
  });
  nodes.sort(sorter);
  for (const node of nodes) {
    if (!(yield node) && !node.isLeaf) {
      yield* iterator(node, node.value, nextDepth, sorter, cache);
    }
  }
}

const isObject = (obj: any): obj is Record<string, any> => {
  return obj !== null && typeof obj === `object`;
};
