import { calledWithFn, CalledWithMock } from 'jest-mock-extended';

export const mockFn = <T extends Function>(): T extends (...args: infer A) => infer B
  ? CalledWithMock<B, A> & T
  : T => {
  // @ts-ignore
  return calledWithFn();
};
