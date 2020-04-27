import { isNumber, isString } from 'ts-type-guards';
import { StringOrNumber } from './types';

export const isStringOrNumber = (x: unknown): x is StringOrNumber => {
  return isString(x) || isNumber(x);
};
