import { Key, StringOrNumber } from '../types/types';

const cacheProp = Symbol.for(`[memoize]`);
const NO_ARGS = `__no_args__`;

export type GenericFunction<A extends any[] = any[], R = any> = (...args: A) => R;

type Check<TSig extends GenericFunction, T, K extends keyof T> = T[K] extends (...a: any[]) => any
  ? T[K] extends TSig
    ? Parameters<T[K]>['length'] extends 0
      ? unknown
      : ['Method must have exactly 0 parameters, Found Parameters:', Parameters<T[K]>]
    : ['Parameters types not matched, expected  [', Parameters<TSig>, '] Found Parameters:', Parameters<T[K]>]
  : unknown;

const defaultKeyBuilder: GenericFunction<[], string> = (): string => {
  return NO_ARGS;
};

const getCache = (target: any): Record<Key, Map<any, any>> => {
  if (!target[cacheProp]) {
    Object.defineProperty(target, cacheProp, {
      value: Object.create(null),
      configurable: true,
    });
  }
  return target[cacheProp];
};

const getKeyCache = (target: any, key: Key): Map<any, any> => {
  const dict = getCache(target);
  const coercedKey: StringOrNumber = typeof key === `symbol` ? (key as any) : key;
  if (!dict[coercedKey]) {
    dict[coercedKey] = new Map<any, any>();
  }
  return dict[coercedKey];
};

const memoizeFn = <A extends any[] = any[]>(
  namespace: Key,
  func: GenericFunction,
  keyBuilder: GenericFunction<A, string>
): GenericFunction => {
  return function (this: any, ...args: A): any {
    const cache = getKeyCache(this, namespace);
    const key = keyBuilder.apply(this, args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const res = func.apply(this, args);
    cache.set(key, res);
    return res;
  };
};

type MemoizeReturnValue<T extends GenericFunction, A extends any[] = Parameters<T>> = <
  TTarget,
  TKey extends keyof TTarget
>(
  _: TTarget,
  propertyKey: TKey,
  descriptor: TypedPropertyDescriptor<GenericFunction<A>>
) => void;

type MemoizeReturnValueNoArgs<T extends () => any> = <TTarget, TKey extends keyof TTarget>(
  _: TTarget,
  propertyKey: TKey & Check<T, TTarget, TKey>,
  descriptor: TypedPropertyDescriptor<GenericFunction<[]>>
) => void;

export function memoize<T extends () => any>(): MemoizeReturnValueNoArgs<T>;
export function memoize<T extends GenericFunction, A extends any[] = Parameters<T>>(
  keyBuilder: GenericFunction<A, string>
): MemoizeReturnValue<T, A>;
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function memoize<T extends GenericFunction, A extends any[] = Parameters<T>>(
  keyBuilder?: GenericFunction<A, string>
): MemoizeReturnValue<T, A> | MemoizeReturnValueNoArgs<T> {
  return <TTarget, TKey extends Key>(
    _: TTarget,
    propertyKey: TKey,
    descriptor: TypedPropertyDescriptor<GenericFunction<A>>
  ): void => {
    descriptor.value = memoizeFn(propertyKey, descriptor.value!, keyBuilder || defaultKeyBuilder);
  };
}
