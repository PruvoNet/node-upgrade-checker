import { Key } from '../types/types';

export interface IRootNode {
  value: unknown;
  isNonRootNode: false;
}

export interface IBaseNode {
  parent: IParent;
  key: string;
  depth: number;
  isNonRootNode: true;
}

export interface ILeafNode extends IBaseNode {
  isLeaf: true;
  value: unknown;
}

export interface INoneLeafNode extends IBaseNode {
  isLeaf: false;
  value: Obj;
}

export type INode = INoneLeafNode | ILeafNode;

export type Obj = Record<Key, unknown>;

export type IParent = INode | IRootNode;
export type ObjectIterator = Generator<INode, void, boolean | undefined>;
export type NodeSorter = (a: INode, b: INode) => number;

export const keySorter: NodeSorter = (a: INode, b: INode) => {
  return a.key.localeCompare(b.key);
};

export function* objectIterator(obj: Obj, sorter?: NodeSorter): ObjectIterator {
  yield* iterator({ value: obj, isNonRootNode: false }, obj, 0, sorter || keySorter, new Set<unknown>());
}

function* iterator(parent: IParent, obj: Obj, depth: number, sorter: NodeSorter, cache: Set<unknown>): ObjectIterator {
  if (cache.has(obj)) {
    return;
  }
  cache.add(obj);
  const nextDepth = depth + 1;
  const nodes: INode[] = Object.keys(obj).map((key) => {
    const value = obj[key];
    if (!isObject(value)) {
      return { key, value, depth, parent, isLeaf: true, isNonRootNode: true };
    } else {
      return { key, value, depth, parent, isLeaf: false, isNonRootNode: true };
    }
  });
  nodes.sort(sorter);
  for (const node of nodes) {
    if (!(yield node) && !node.isLeaf) {
      yield* iterator(node, node.value, nextDepth, sorter, cache);
    }
  }
}

const isObject = (obj: unknown): obj is Record<string, unknown> => {
  return obj !== null && typeof obj === `object`;
};
