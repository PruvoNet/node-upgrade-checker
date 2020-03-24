import { loggerFactory } from '../../../../common/logger';
import { CiResolver } from '../../../../../src/resolvers/ciResolver/impl/ciResolver';
import moment = require('moment');
import {
  ICIResolveOptions,
  ISpecificCIResolver,
  ISpecificCIResolverOptions,
} from '../../../../../src/resolvers/ciResolver';
import { when } from 'jest-when';
import { ISpecificCIResolverRunner } from '../../../../../src/resolvers/ciResolver/interfaces/ISpecificCIResolverRunner';
import { mock, mockReset } from 'jest-mock-extended';

describe(`ci resolver`, () => {
  const targetNode = `6`;
  const repoPath = `repoPath`;
  const packageReleaseDate = moment();
  const resolveOptions: ICIResolveOptions = {
    targetNode,
    repoPath,
    packageReleaseDate,
  };
  const resolveSpecificOptions: ISpecificCIResolverOptions = {
    repoPath,
  };
  const resolverName1 = `resolverName1`;
  const resolverMock1 = mock<ISpecificCIResolver>({
    resolverName: resolverName1,
  });
  const resolverName2 = `resolverName2`;
  const resolverMock2 = mock<ISpecificCIResolver>({
    resolverName: resolverName2,
  });
  const resolvers: ISpecificCIResolver[] = [resolverMock1, resolverMock2];
  const specificCIResolverRunnerMock = mock<ISpecificCIResolverRunner>();
  const ciResolver = new CiResolver(resolvers, specificCIResolverRunnerMock, loggerFactory);

  beforeEach(() => {
    mockReset(specificCIResolverRunnerMock);
    mockReset(resolverMock1);
    mockReset(resolverMock2);
  });

  it(`should resolve with 1 relevant and 1 matching`, async () => {
    resolverMock1.isRelevant.mockResolvedValue(true);
    resolverMock2.isRelevant.mockResolvedValue(false);
    specificCIResolverRunnerMock.resolve.mockResolvedValue({
      isMatch: true,
      resolverName: resolverName1,
    });
    const result = await ciResolver.resolve(resolveOptions);
    expect(result).toEqual({
      isMatch: true,
      resolverName: resolverName1,
    });
    expect(resolverMock1.isRelevant).toHaveBeenCalledTimes(1);
    expect(resolverMock1.isRelevant).toHaveBeenCalledWith(resolveSpecificOptions);
    expect(resolverMock2.isRelevant).toHaveBeenCalledTimes(1);
    expect(resolverMock2.isRelevant).toHaveBeenCalledWith(resolveSpecificOptions);
    expect(specificCIResolverRunnerMock.resolve).toHaveBeenCalledTimes(1);
    expect(specificCIResolverRunnerMock.resolve.mock.calls[0][0].resolver).toBe(resolverMock1);
    expect(specificCIResolverRunnerMock.resolve.mock.calls[0][0]).toEqual(expect.objectContaining(resolveOptions));
  });

  it(`should resolve with 2 relevant and 2 matching`, async () => {
    resolverMock1.isRelevant.mockResolvedValue(true);
    resolverMock2.isRelevant.mockResolvedValue(true);
    specificCIResolverRunnerMock.resolve.mockResolvedValueOnce({
      isMatch: true,
      resolverName: resolverName1,
    });
    specificCIResolverRunnerMock.resolve.mockResolvedValueOnce({
      isMatch: true,
      resolverName: resolverName2,
    });
    const result = await ciResolver.resolve(resolveOptions);
    expect(result).toEqual({
      isMatch: true,
      resolverName: resolverName1,
    });
    expect(resolverMock1.isRelevant).toHaveBeenCalledTimes(1);
    expect(resolverMock1.isRelevant).toHaveBeenCalledWith(resolveSpecificOptions);
    expect(resolverMock2.isRelevant).toHaveBeenCalledTimes(1);
    expect(resolverMock2.isRelevant).toHaveBeenCalledWith(resolveSpecificOptions);
    expect(specificCIResolverRunnerMock.resolve).toHaveBeenCalledTimes(2);
    expect(specificCIResolverRunnerMock.resolve.mock.calls[0][0].resolver).toBe(resolverMock1);
    expect(specificCIResolverRunnerMock.resolve.mock.calls[0][0]).toEqual(expect.objectContaining(resolveOptions));
    expect(specificCIResolverRunnerMock.resolve.mock.calls[1][0].resolver).toBe(resolverMock2);
    expect(specificCIResolverRunnerMock.resolve.mock.calls[1][0]).toEqual(expect.objectContaining(resolveOptions));
  });

  it(`should resolve with 2 relevant and 1 matching`, async () => {
    resolverMock1.isRelevant.mockResolvedValue(true);
    resolverMock2.isRelevant.mockResolvedValue(true);
    const resolveCallArgs1 = {
      ...resolveOptions,
      resolver: resolverMock1,
    };
    const resolveCallArgs2 = {
      ...resolveOptions,
      resolver: resolverMock2,
    };
    when(specificCIResolverRunnerMock.resolve)
      .calledWith(resolveCallArgs1)
      .mockResolvedValue({
        isMatch: false,
      })
      .calledWith(resolveCallArgs2)
      .mockResolvedValue({
        isMatch: true,
        resolverName: resolverName2,
      });
    const result = await ciResolver.resolve(resolveOptions);
    expect(result).toEqual({
      isMatch: true,
      resolverName: resolverName2,
    });
    expect(resolverMock1.isRelevant).toHaveBeenCalledTimes(1);
    expect(resolverMock1.isRelevant).toHaveBeenCalledWith(resolveSpecificOptions);
    expect(resolverMock2.isRelevant).toHaveBeenCalledTimes(1);
    expect(resolverMock2.isRelevant).toHaveBeenCalledWith(resolveSpecificOptions);
    expect(specificCIResolverRunnerMock.resolve).toHaveBeenCalledTimes(2);
    expect(specificCIResolverRunnerMock.resolve.mock.calls[0][0].resolver).toBe(resolverMock1);
    expect(specificCIResolverRunnerMock.resolve.mock.calls[0][0]).toEqual(expect.objectContaining(resolveOptions));
    expect(specificCIResolverRunnerMock.resolve.mock.calls[1][0].resolver).toBe(resolverMock2);
    expect(specificCIResolverRunnerMock.resolve.mock.calls[1][0]).toEqual(expect.objectContaining(resolveOptions));
  });
});
