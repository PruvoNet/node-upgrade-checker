const cacheProp = Symbol.for(`[memoize]`);

export type GenericFunction<A extends any[] = any[], R = any> = (...args: A) => R;

const defaultKeyBuilder: GenericFunction<[], string> = (): string => {
  return `__no_args__`;
};

const getCache = (target: any): Record<string, Map<any, any>> => {
  if (!target[cacheProp]) {
    Object.defineProperty(target, cacheProp, {
      value: Object.create(null),
      configurable: true,
    });
  }
  return target[cacheProp];
};

const getKeyCache = (target: any, key: string): Map<any, any> => {
  const dict = getCache(target);
  if (!dict[key]) {
    dict[key] = new Map<any, any>();
  }
  return dict[key];
};

const memoizeFn = <A extends any[] = any[]>(
  namespace: string,
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

type MemoizeReturn<
  T extends Function,
  A extends any[] = T extends (...args: infer AReal) => any ? AReal : any[],
  R = T extends (...args: any) => infer RReal ? RReal : any
> = (_: object, propertyKey: string, descriptor: TypedPropertyDescriptor<GenericFunction<A, R>>) => void;

type Memoize = {
  <T extends () => any, A extends [] = [], R = T extends () => infer RReal ? RReal : any>(): MemoizeReturn<T, A, R>;
  <
    T extends Function,
    A extends any[] = T extends (...args: infer AReal) => any ? AReal : any[],
    R = T extends (...args: any) => infer RReal ? RReal : any
  >(
    keyBuilder: GenericFunction<A, string>
  ): MemoizeReturn<T, A, R>;
};

export const memoize: Memoize = <
  T extends Function,
  A extends any[] = T extends (...args: infer AReal) => any ? AReal : any[],
  R = T extends (...args: any) => infer RReal ? RReal : any
>(
  keyBuilder?: GenericFunction<A, string>
): MemoizeReturn<T, A, R> => {
  return (_: object, propertyKey: string, descriptor: TypedPropertyDescriptor<GenericFunction<A, R>>): void => {
    descriptor.value = memoizeFn(propertyKey, descriptor.value!, keyBuilder || defaultKeyBuilder);
  };
};
