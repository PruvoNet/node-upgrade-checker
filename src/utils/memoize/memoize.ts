const cacheProp = Symbol.for(`[memoize]`);

export type GenericFunction = (...args: any[]) => any;

const defaultKeyBuilder = (v: any): any => {
  return v;
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

const memoizeFn = (namespace: string, func: GenericFunction, keyBuilder: GenericFunction): GenericFunction => {
  return function(this: any, ...args: any[]): any {
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

export const memoize = (keyBuilder?: GenericFunction) => {
  return (_: object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): void => {
    descriptor.value = memoizeFn(propertyKey, descriptor.value, keyBuilder || defaultKeyBuilder);
  };
};
