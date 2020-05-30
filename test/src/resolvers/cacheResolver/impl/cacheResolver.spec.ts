import { Dependency, IDependencyRepositoryProvider } from '../../../../../src/db';
import { Repository } from 'typeorm';
import { CacheResolver } from '../../../../../src/resolvers/cacheResolver/impl/cacheResolver';
import { loggerFactory } from '../../../../common/logger';
import { mock, mockReset } from 'jest-mock-extended';

describe(`cache resolver`, () => {
  const repositoryMock = mock<Repository<Dependency>>();
  const dependencyRepositoryProviderMock = mock<IDependencyRepositoryProvider>();
  // @ts-ignore
  dependencyRepositoryProviderMock.getRepository.mockResolvedValue(repositoryMock);
  const cacheResolver = new CacheResolver(dependencyRepositoryProviderMock, loggerFactory);

  beforeEach(() => {
    mockReset(repositoryMock);
  });

  it(`should resolve if match in cache`, async () => {
    const dependency = new Dependency({
      targetNode: `12`,
      match: true,
      version: `4.0.1`,
      name: `test dependency`,
      reason: `circleCi`,
    });
    repositoryMock.findOne.mockResolvedValue(dependency);
    const targetNode = `8`;
    const result = await cacheResolver.resolve({
      repo: {
        version: dependency.version,
        name: dependency.name,
      },
      targetNode,
    });
    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      name: dependency.name,
      version: dependency.version,
      targetNode,
    });
    expect(result).toEqual({
      isMatch: true,
      resolverName: `circleCi (cache)`,
      result: true,
    });
  });

  it(`should resolve if no match in cache`, async () => {
    const dependency = new Dependency({
      targetNode: `12`,
      match: false,
      version: `4.0.1`,
      name: `test dependency`,
      reason: null,
    });
    repositoryMock.findOne.mockResolvedValue(dependency);
    const targetNode = `8`;
    const result = await cacheResolver.resolve({
      repo: {
        version: dependency.version,
        name: dependency.name,
      },
      targetNode,
    });
    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      name: dependency.name,
      version: dependency.version,
      targetNode,
    });
    expect(result).toEqual({
      isMatch: true,
      result: false,
    });
  });

  it(`should not resolve if not in cache`, async () => {
    const dependency = new Dependency({
      targetNode: `12`,
      match: true,
      version: `4.0.1`,
      name: `test dependency`,
      reason: `circleCi`,
    });
    repositoryMock.findOne.mockResolvedValue(undefined);
    const targetNode = `8`;
    const result = await cacheResolver.resolve({
      repo: {
        version: dependency.version,
        name: dependency.name,
      },
      targetNode,
    });
    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      name: dependency.name,
      version: dependency.version,
      targetNode,
    });
    expect(result).toEqual({
      isMatch: false,
    });
  });

  it(`should not resolve if cache error`, async () => {
    const dependency = new Dependency({
      targetNode: `12`,
      match: true,
      version: `4.0.1`,
      name: `test dependency`,
      reason: `circleCi`,
    });
    repositoryMock.findOne.mockRejectedValue(new Error());
    const targetNode = `8`;
    const result = await cacheResolver.resolve({
      repo: {
        version: dependency.version,
        name: dependency.name,
      },
      targetNode,
    });
    expect(repositoryMock.findOne).toHaveBeenCalledWith({
      name: dependency.name,
      version: dependency.version,
      targetNode,
    });
    expect(result.isMatch).toBe(false);
  });
});
