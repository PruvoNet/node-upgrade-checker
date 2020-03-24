import { loggerFactory } from '../../../../common/logger';
import moment = require('moment');
import { SpecificCIResolverRunner } from '../../../../../src/resolvers/ciResolver/impl/specificCIResolverRunner';
import { ISpecificCIResolverRunnerOptions } from '../../../../../src/resolvers/ciResolver/interfaces/ISpecificCIResolverRunner';
import {
  ISpecificCIResolver,
  ISpecificCIResolverOptions,
  ITargetMatcher,
} from '../../../../../src/resolvers/ciResolver';
import { mock, mockReset } from 'jest-mock-extended';

describe(`specific ci resolver runner`, () => {
  const targetNode = `6`;
  const repoPath = `repoPath`;
  const packageReleaseDate = moment();
  const matchingVersions = new Set([`1`, `2`]);
  const resolverName = `resolverName`;
  const resolverMock = mock<ISpecificCIResolver>({
    resolverName,
  });
  const targetMatcherMock = mock<ITargetMatcher>();
  const specificCIResolverRunner = new SpecificCIResolverRunner(targetMatcherMock, loggerFactory);
  const resolveOptions: ISpecificCIResolverRunnerOptions = {
    targetNode,
    repoPath,
    packageReleaseDate,
    resolver: resolverMock,
  };
  const resolveSpecificOptions: ISpecificCIResolverOptions = {
    repoPath,
  };

  beforeEach(() => {
    mockReset(targetMatcherMock);
    mockReset(resolverMock);
  });

  it(`should match`, async () => {
    resolverMock.resolve.mockResolvedValue({
      nodeVersions: matchingVersions,
    });
    targetMatcherMock.match.mockResolvedValue(true);
    const result = await specificCIResolverRunner.resolve(resolveOptions);
    expect(result).toEqual({
      isMatch: true,
      resolverName,
    });
    expect(resolverMock.resolve).toHaveBeenCalledTimes(1);
    expect(resolverMock.resolve).toHaveBeenCalledWith(resolveSpecificOptions);
    expect(targetMatcherMock.match).toHaveBeenCalledTimes(1);
    expect(targetMatcherMock.match).toHaveBeenCalledWith({
      candidates: matchingVersions,
      targetNode,
      packageReleaseDate,
    });
  });

  it(`should not match with with non matching node versions`, async () => {
    resolverMock.resolve.mockResolvedValue({
      nodeVersions: matchingVersions,
    });
    targetMatcherMock.match.mockResolvedValue(false);
    const result = await specificCIResolverRunner.resolve(resolveOptions);
    expect(result).toEqual({
      isMatch: false,
    });
    expect(resolverMock.resolve).toHaveBeenCalledTimes(1);
    expect(resolverMock.resolve).toHaveBeenCalledWith(resolveSpecificOptions);
    expect(targetMatcherMock.match).toHaveBeenCalledTimes(1);
    expect(targetMatcherMock.match).toHaveBeenCalledWith({
      candidates: matchingVersions,
      targetNode,
      packageReleaseDate,
    });
  });

  it(`should not match with with not found node versions`, async () => {
    resolverMock.resolve.mockResolvedValue({
      nodeVersions: new Set([]),
    });
    const result = await specificCIResolverRunner.resolve(resolveOptions);
    expect(result).toEqual({
      isMatch: false,
    });
    expect(resolverMock.resolve).toHaveBeenCalledTimes(1);
    expect(resolverMock.resolve).toHaveBeenCalledWith(resolveSpecificOptions);
    expect(targetMatcherMock.match).toHaveBeenCalledTimes(0);
  });

  it(`should not match with with resolver throws exception`, async () => {
    resolverMock.resolve.mockRejectedValue(new Error(`dummy error`));
    const result = await specificCIResolverRunner.resolve(resolveOptions);
    expect(result).toEqual({
      isMatch: false,
    });
    expect(resolverMock.resolve).toHaveBeenCalledTimes(1);
    expect(resolverMock.resolve).toHaveBeenCalledWith(resolveSpecificOptions);
    expect(targetMatcherMock.match).toHaveBeenCalledTimes(0);
  });
});
