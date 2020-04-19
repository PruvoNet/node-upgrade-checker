import { isNumber, isString } from 'ts-type-guards';
import { StringOrNumber } from './types';

export const isStringOrNumber = (x: any): x is StringOrNumber => {
  return isString(x) || isNumber(x);
};
