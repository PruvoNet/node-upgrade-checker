import { dependencyTypeHandler } from '../../../../../src/utils/manifestParser/impl/dependencyTypeHandler';
import { mock } from 'jest-mock-extended';
import { ILogger } from '../../../../../src/utils/logger/interfaces/ILogger';
import { DependencyType, IDependency } from '../../../../../src/utils/manifestParser/types';
import { IPredicate } from '../../../../../src/utils/predicateBuilder/predicateBuilder';

const dependencies = {
  a: `v:a`,
  b: `v:b`,
  c: `v:c`,
  d: `v:d`,
};

const truthPredicate: IPredicate = () => true;
const logger = mock<ILogger>();

const baseOptions = {
  included: true,
  dependencies,
  logger,
  type: DependencyType.DEV,
  predicate: truthPredicate,
};

describe(`dependency type handler`, () => {
  it(`should return no results if dependency not included`, () => {
    const result = dependencyTypeHandler({
      ...baseOptions,
      included: false,
    });
    expect(result.size).toEqual(0);
  });

  it(`should return no results if undefined dependencies received`, () => {
    const result = dependencyTypeHandler({
      ...baseOptions,
      dependencies: undefined,
    });
    expect(result.size).toEqual(0);
  });

  it(`should return no results if no dependencies received`, () => {
    const result = dependencyTypeHandler({
      ...baseOptions,
      dependencies: {},
    });
    expect(result.size).toEqual(0);
  });

  it(`should return no results if no dependencies match predicate`, () => {
    const result = dependencyTypeHandler({
      ...baseOptions,
      predicate: () => false,
    });
    expect(result.size).toEqual(0);
  });

  it(`should return all dependencies`, () => {
    const result = dependencyTypeHandler({
      ...baseOptions,
    });
    expect(result).toEqual(
      new Set<IDependency>([
        {
          name: `a`,
          semver: `v:a`,
          dependencyType: DependencyType.DEV,
        },
        {
          name: `b`,
          semver: `v:b`,
          dependencyType: DependencyType.DEV,
        },
        {
          name: `c`,
          semver: `v:c`,
          dependencyType: DependencyType.DEV,
        },
        {
          name: `d`,
          semver: `v:d`,
          dependencyType: DependencyType.DEV,
        },
      ])
    );
  });

  it(`should return filtered dependencies`, () => {
    const result = dependencyTypeHandler({
      ...baseOptions,
      predicate: (name: string): boolean => name === `b` || name === `d`,
    });
    expect(result).toEqual(
      new Set<IDependency>([
        {
          name: `b`,
          semver: `v:b`,
          dependencyType: DependencyType.DEV,
        },
        {
          name: `d`,
          semver: `v:d`,
          dependencyType: DependencyType.DEV,
        },
      ])
    );
  });
});
