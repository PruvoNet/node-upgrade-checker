/* eslint-disable jest/no-export */
import { interfaces } from 'inversify';
import Bind = interfaces.Bind;

export type BinderFn = (bind: Bind) => void;

export enum BindingTypes {
  SINGELTON = `SINGELTON`,
  CONSTANT = `CONSTANT`,
}

export interface IBindingToTest {
  binder: any;
  binded: any;
  type: BindingTypes;
}

export interface IBindingTestOptions {
  bindings: IBindingToTest[];
  binderFn: BinderFn;
  name: string;
}

const getBindName = (bind: any): string => {
  if (typeof bind === `symbol`) {
    return bind.toString();
  }
  return bind.name || bind.constructor?.name || bind.toString?.() || bind;
};

export const testBindings = ({ binderFn, bindings, name }: IBindingTestOptions): void => {
  describe(name, () => {
    const inSingletonScopeMock = jest.fn();
    const toSpy = {
      inSingletonScope: inSingletonScopeMock,
    };
    const toMock = jest.fn();
    toMock.mockReturnValue(toSpy);
    const toConstantValueMock = jest.fn();
    const bindSpy = {
      to: toMock,
      toConstantValue: toConstantValueMock,
    };
    const bindMock = jest.fn();
    bindMock.mockReturnValue(bindSpy);
    binderFn(bindMock);
    let bindExpectedCalls = 0;
    let toExpectedCalls = 0;
    let toConstantValueExpectedCalls = 0;
    let inSingletonScopeExpectedCalls = 0;
    bindings.forEach((binding) => {
      const { binder, binded, type } = binding;
      it(`Should bind ${getBindName(binder)} to ${getBindName(binded)} - ${type}`, () => {
        bindExpectedCalls++;
        expect(bindMock).toHaveBeenNthCalledWith(bindExpectedCalls, binder);
        if (type === BindingTypes.SINGELTON) {
          toExpectedCalls++;
          inSingletonScopeExpectedCalls++;
          expect(toMock).toHaveBeenNthCalledWith(toExpectedCalls, binded);
          expect(inSingletonScopeMock).toHaveBeenNthCalledWith(inSingletonScopeExpectedCalls);
        } else if (type === BindingTypes.CONSTANT) {
          toConstantValueExpectedCalls++;
          expect(toConstantValueMock).toHaveBeenNthCalledWith(toConstantValueExpectedCalls, binded);
        }
      });
    });
    it(`Should not call more bindings than expected`, () => {
      expect(bindMock).toHaveBeenCalledTimes(bindExpectedCalls);
      expect(toMock).toHaveBeenCalledTimes(toExpectedCalls);
      expect(toConstantValueMock).toHaveBeenCalledTimes(toConstantValueExpectedCalls);
      expect(inSingletonScopeMock).toHaveBeenCalledTimes(inSingletonScopeExpectedCalls);
    });
  });
};
