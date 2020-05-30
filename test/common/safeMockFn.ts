import { calledWithFn, CalledWithMock } from 'jest-mock-extended';

// eslint-disable-next-line @typescript-eslint/ban-types
export const mockFn = <T extends Function>(): T extends (...args: infer A) => infer B
  ? CalledWithMock<B, A> & T
  : T => {
  // @ts-ignore
  return calledWithFn();
};
