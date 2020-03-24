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

export function* objectIterator(obj: any): ObjectIterator {
  yield* iterator({ value: obj }, obj, 0);
}

function* iterator(parent: IParent, obj: any, depth: number): ObjectIterator {
  if (!isObject(obj)) {
    return;
  }
  const nextDepth = depth + 1;
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const node: INode = { key, value, depth, parent };
    if (!(yield node)) {
      yield* iterator(node, value, nextDepth);
    }
  }
}

const isObject = (obj: any): obj is Record<string, any> => {
  return obj !== null && typeof obj === `object`;
};
