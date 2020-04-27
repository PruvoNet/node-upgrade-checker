/* eslint-disable jest/no-export */
/* eslint-disable @typescript-eslint/unbound-method */
import { interfaces, METADATA_KEY } from 'inversify';
import Bind = interfaces.Bind;
import Request = interfaces.Request;
import BindingWhenOnSyntax = interfaces.BindingWhenOnSyntax;
import BindingInWhenOnSyntax = interfaces.BindingInWhenOnSyntax;
import { Constraint } from '../../../src/container/utils';
import Abstract = interfaces.Abstract;
import { mock, mockClear, mockDeep } from 'jest-mock-extended';
import BindingToSyntax = interfaces.BindingToSyntax;
import { mockFn } from '../safeMockFn';
import { when } from 'jest-when';

export type BinderFn = (bind: Bind) => void;

export enum BindingTypes {
  SINGELTON = `SINGELTON`,
  CONSTANT = `CONSTANT`,
  SELF = `SELF`,
}

export interface IBindingToTest {
  binder: any;
  binded: any;
  type: BindingTypes;
  tag?: symbol;
  multi?: boolean;
}

export interface IBindingTestOptions {
  bindings: IBindingToTest[];
  binderFn: BinderFn;
  name: string;
}

interface ConstraintTest {
  constraint: Constraint;
  binding: {
    binder: any;
    tag: symbol;
    multi: boolean;
  };
}

const getBindName = (bind: any): string => {
  if (typeof bind === `symbol`) {
    return bind.toString();
  } else if (typeof bind === `string`) {
    return bind;
  }
  return bind.name || bind.constructor?.name || bind.toString?.() || bind;
};

export const testNameOrMultiConstraint = (symbol: symbol, target: Abstract<any>, constraint: Constraint): void => {
  const matchesTagNameMock = mockFn<ReturnType<Request['target']['matchesTag']>>();
  const matchesTagMultiMock = mockFn<ReturnType<Request['target']['matchesTag']>>();
  const requestMock = mockDeep<Request>();
  when(requestMock.target.matchesTag).calledWith(METADATA_KEY.NAMED_TAG).mockReturnValue(matchesTagNameMock);
  when(requestMock.target.matchesTag).calledWith(METADATA_KEY.MULTI_INJECT_TAG).mockReturnValue(matchesTagMultiMock);

  beforeEach(() => {
    matchesTagNameMock.mockReset();
    matchesTagMultiMock.mockReset();
    mockClear(requestMock);
  });

  it(`should match by multi inject`, () => {
    matchesTagMultiMock.mockReturnValue(true);
    const result = constraint(requestMock);
    expect(result).toBe(true);
    expect(requestMock.target.matchesTag).toHaveBeenCalledTimes(1);
    expect(matchesTagNameMock).toHaveBeenCalledTimes(0);
    expect(matchesTagMultiMock).toHaveBeenCalledTimes(1);
    expect(requestMock.target.matchesTag).toHaveBeenCalledWith(METADATA_KEY.MULTI_INJECT_TAG);
    expect(matchesTagMultiMock).toHaveBeenCalledWith(target);
  });

  it(`should match by name`, () => {
    matchesTagNameMock.mockReturnValue(true);
    matchesTagMultiMock.mockReturnValue(false);
    const result = constraint(requestMock);
    expect(result).toBe(true);
    expect(requestMock.target.matchesTag).toHaveBeenCalledTimes(2);
    expect(matchesTagNameMock).toHaveBeenCalledTimes(1);
    expect(matchesTagMultiMock).toHaveBeenCalledTimes(1);
    expect(requestMock.target.matchesTag).toHaveBeenCalledWith(METADATA_KEY.NAMED_TAG);
    expect(matchesTagNameMock).toHaveBeenCalledWith(symbol);
    expect(requestMock.target.matchesTag).toHaveBeenCalledWith(METADATA_KEY.MULTI_INJECT_TAG);
    expect(matchesTagMultiMock).toHaveBeenCalledWith(target);
  });

  it(`should fail to match`, () => {
    matchesTagNameMock.mockReturnValue(false);
    matchesTagMultiMock.mockReturnValue(false);
    const result = constraint(requestMock);
    expect(result).toBe(false);
    expect(requestMock.target.matchesTag).toHaveBeenCalledTimes(2);
    expect(matchesTagNameMock).toHaveBeenCalledTimes(1);
    expect(matchesTagMultiMock).toHaveBeenCalledTimes(1);
    expect(requestMock.target.matchesTag).toHaveBeenCalledWith(METADATA_KEY.NAMED_TAG);
    expect(matchesTagNameMock).toHaveBeenCalledWith(symbol);
    expect(requestMock.target.matchesTag).toHaveBeenCalledWith(METADATA_KEY.MULTI_INJECT_TAG);
    expect(matchesTagMultiMock).toHaveBeenCalledWith(target);
  });
};

export const testBindings = ({ binderFn, bindings, name }: IBindingTestOptions): void => {
  describe(name, () => {
    const bindingWhenOnSyntaxMock = mock<BindingWhenOnSyntax<any>>();
    const bindingInWhenOnSyntaxMock = mock<BindingInWhenOnSyntax<any>>();
    bindingInWhenOnSyntaxMock.inSingletonScope.mockReturnValue(bindingWhenOnSyntaxMock);
    const bindingToSyntaxMock = mock<BindingToSyntax<any>>();
    bindingToSyntaxMock.to.mockReturnValue(bindingInWhenOnSyntaxMock);
    bindingToSyntaxMock.toSelf.mockReturnValue(bindingInWhenOnSyntaxMock);
    bindingToSyntaxMock.toConstantValue.mockReturnValue(bindingWhenOnSyntaxMock);
    const bindMock = mockFn<Bind>();
    bindMock.mockReturnValue(bindingToSyntaxMock);
    binderFn(bindMock);
    let bindExpectedCalls = 0;
    let toExpectedCalls = 0;
    let toSelfExpectedCalls = 0;
    let toConstantValueExpectedCalls = 0;
    let inSingletonScopeExpectedCalls = 0;
    let whenTestCalls = 0;
    const constraintTests: ConstraintTest[] = [];
    bindings.forEach(({ binder, binded, type, tag, multi }) => {
      if (tag && multi) {
        const constraint = bindingWhenOnSyntaxMock.when.mock.calls[whenTestCalls][0];
        constraintTests.push({
          constraint,
          binding: {
            binder,
            multi,
            tag,
          },
        });
        whenTestCalls++;
      }
      it(`Should bind ${getBindName(binder)} to ${getBindName(binded)} - ${type}`, () => {
        bindExpectedCalls++;
        expect(bindMock).toHaveBeenNthCalledWith(bindExpectedCalls, binder);
        if (type === BindingTypes.SINGELTON) {
          inSingletonScopeExpectedCalls++;
          if (binded === BindingTypes.SELF) {
            toSelfExpectedCalls++;
            expect(bindingToSyntaxMock.toSelf).toHaveBeenNthCalledWith(toSelfExpectedCalls);
          } else {
            toExpectedCalls++;
            expect(bindingToSyntaxMock.to).toHaveBeenNthCalledWith(toExpectedCalls, binded);
          }
          expect(bindingInWhenOnSyntaxMock.inSingletonScope).toHaveBeenNthCalledWith(inSingletonScopeExpectedCalls);
        } else if (type === BindingTypes.CONSTANT) {
          toConstantValueExpectedCalls++;
          expect(bindingToSyntaxMock.toConstantValue).toHaveBeenNthCalledWith(toConstantValueExpectedCalls, binded);
        }
      });
    });
    constraintTests.forEach(({ constraint, binding }) => {
      const { binder, tag } = binding;
      describe(`Should bind ${getBindName(binder)} to ${tag.toString()} and multi inject`, () => {
        testNameOrMultiConstraint(tag, binder, constraint);
      });
    });
    it(`Should not call more bindings than expected`, () => {
      expect(bindMock).toHaveBeenCalledTimes(bindExpectedCalls);
      expect(bindingToSyntaxMock.to).toHaveBeenCalledTimes(toExpectedCalls);
      expect(bindingToSyntaxMock.toSelf).toHaveBeenCalledTimes(toSelfExpectedCalls);
      expect(bindingToSyntaxMock.toConstantValue).toHaveBeenCalledTimes(toConstantValueExpectedCalls);
      expect(bindingInWhenOnSyntaxMock.inSingletonScope).toHaveBeenCalledTimes(inSingletonScopeExpectedCalls);
      expect(bindingWhenOnSyntaxMock.when).toHaveBeenCalledTimes(whenTestCalls);
    });
  });
};
