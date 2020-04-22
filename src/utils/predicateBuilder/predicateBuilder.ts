import { isString } from 'ts-type-guards';

const fromPrimitive = (input: string | RegExp): IPredicate => {
  if (isString(input)) {
    return (predicate: string): boolean => predicate === input;
  }
  return (predicate: string): boolean => input.test(predicate);
};

const truthy: IPredicate = (): boolean => true;

const not = (predicate: IPredicate): IPredicate => (str: string): boolean => !predicate(str);

const or = (predicate1: IPredicate, predicate2: IPredicate): IPredicate => (str: string): boolean =>
  predicate1(str) || predicate2(str);

const and = (predicate1: IPredicate, predicate2: IPredicate): IPredicate => (str: string): boolean =>
  predicate1(str) && predicate2(str);

const orReducer = (prev: IPredicate, current: IPredicate): IPredicate => {
  return or(prev, current);
};

const andReducer = (prev: IPredicate, current: IPredicate): IPredicate => {
  return and(prev, current);
};

export type IPredicate = (str: string) => boolean;
export type Filter = (string | RegExp)[];

export const buildPredicate = (include: Filter, exclude: Filter): IPredicate => {
  const includePredicateArr = include.map(fromPrimitive);
  if (includePredicateArr.length === 0) {
    includePredicateArr.push(truthy);
  }
  const includePredicate = includePredicateArr.reduce(orReducer);
  const excludePredicateArr = exclude.map(fromPrimitive).map(not);
  if (excludePredicateArr.length === 0) {
    excludePredicateArr.push(truthy);
  }
  const excludePredicate = excludePredicateArr.reduce(andReducer);
  return and(includePredicate, excludePredicate);
};
