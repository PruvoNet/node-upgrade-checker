import { Matcher } from 'jest-mock-extended';
import { equals } from 'expect/build/jasmineUtils';

export const isEqual = <T>(expectedValue: T): Matcher<T> =>
  new Matcher<T>((actualValue: T) => {
    return equals(actualValue, expectedValue);
  });
