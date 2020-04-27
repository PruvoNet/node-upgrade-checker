import { IPackageInfo } from '../../../../src/utils/packageInfo';
import { mock, mockReset } from 'jest-mock-extended';
import { DependencyVersion, IDependencyVersionRepositoryProvider } from '../../../../src/db';
import { Repository } from 'typeorm';
import { PackageInfoCache } from '../../../../src/dependencyChecker/impl/packageInfoCache';
import { loggerFactory } from '../../../common/logger';
import { when } from 'jest-when';

describe(`package info cache`, () => {
  const packageInfoMock = mock<IPackageInfo>();
  const repositoryMock = mock<Repository<DependencyVersion>>();
  const dependencyVersionRepositoryProviderMock = mock<IDependencyVersionRepositoryProvider>();
  dependencyVersionRepositoryProviderMock.getRepository.mockResolvedValue(repositoryMock);
  let packageInfoCache: PackageInfoCache;

  beforeEach(() => {
    mockReset(packageInfoMock);
    mockReset(repositoryMock);
    packageInfoCache = new PackageInfoCache(packageInfoMock, dependencyVersionRepositoryProviderMock, loggerFactory);
  });

  it(`should memoize package info results`, async () => {
    const dependencyVersion = new DependencyVersion({
      version: `4.0.1`,
      name: `test dependency`,
      repoUrl: null,
      repoDirectory: null,
      commitSha: null,
      releaseDate: null,
      engines: null,
      testScript: null,
      buildScript: null,
    });
    const getOptions = { name: `test dependency`, semver: `~4.0.0` };
    when(packageInfoMock.resolvePackageVersion).calledWith(getOptions).mockResolvedValue(`4.0.1`);
    when(repositoryMock.findOne)
      .calledWith({ name: `test dependency`, version: `4.0.1` })
      .mockResolvedValue(dependencyVersion);
    const result = await packageInfoCache.getPackageInfo(getOptions);
    expect(result).toEqual(dependencyVersion);
    const result2 = await packageInfoCache.getPackageInfo(getOptions);
    expect(result).toEqual(dependencyVersion);
    expect(result).toBe(result2);
    expect(repositoryMock.findOne).toBeCalledTimes(1);
  });

  it(`should return from cache`, async () => {
    const dependencyVersion = new DependencyVersion({
      version: `4.0.1`,
      name: `test dependency`,
      repoUrl: null,
      repoDirectory: null,
      commitSha: null,
      releaseDate: null,
      engines: null,
      testScript: null,
      buildScript: null,
    });
    const getOptions = { name: `test dependency`, semver: `~4.0.0` };
    when(packageInfoMock.resolvePackageVersion).calledWith(getOptions).mockResolvedValue(`4.0.1`);
    when(repositoryMock.findOne)
      .calledWith({ name: `test dependency`, version: `4.0.1` })
      .mockResolvedValue(dependencyVersion);
    const result = await packageInfoCache.getPackageInfo(getOptions);
    expect(result).toEqual(dependencyVersion);
  });

  it(`should get info if not in cache`, async () => {
    const packageInfo = {
      version: `4.0.1`,
      name: `test dependency`,
    };
    const dependencyVersion = new DependencyVersion({
      ...packageInfo,
      repoUrl: null,
      repoDirectory: null,
      commitSha: null,
      releaseDate: null,
      engines: null,
      testScript: null,
      buildScript: null,
    });
    const getOptions = { name: `test dependency`, semver: `~4.0.0` };
    when(packageInfoMock.resolvePackageVersion).calledWith(getOptions).mockResolvedValue(`4.0.1`);
    when(packageInfoMock.getPackageInfo)
      .calledWith({ name: `test dependency`, version: `4.0.1` })
      .mockResolvedValue(packageInfo);
    const result = await packageInfoCache.getPackageInfo(getOptions);
    expect(result).toEqual(dependencyVersion);
    expect(repositoryMock.save).toBeCalledTimes(1);
    expect(repositoryMock.save).toBeCalledWith(dependencyVersion);
  });

  it(`should get info if not cache throws`, async () => {
    const packageInfo = {
      version: `4.0.1`,
      name: `test dependency`,
    };
    const dependencyVersion = new DependencyVersion({
      ...packageInfo,
      repoUrl: null,
      repoDirectory: null,
      commitSha: null,
      releaseDate: null,
      engines: null,
      testScript: null,
      buildScript: null,
    });
    const getOptions = { name: `test dependency`, semver: `~4.0.0` };
    when(packageInfoMock.resolvePackageVersion).calledWith(getOptions).mockResolvedValue(`4.0.1`);
    when(repositoryMock.findOne)
      .calledWith({ name: `test dependency`, version: `4.0.1` })
      .mockRejectedValue(new Error(`dummy`));
    when(packageInfoMock.getPackageInfo)
      .calledWith({ name: `test dependency`, version: `4.0.1` })
      .mockResolvedValue(packageInfo);
    const result = await packageInfoCache.getPackageInfo(getOptions);
    expect(result).toEqual(dependencyVersion);
    expect(repositoryMock.save).toBeCalledTimes(1);
    expect(repositoryMock.save).toBeCalledWith(dependencyVersion);
  });

  it(`Should update commit`, async () => {
    const dependencyVersion = new DependencyVersion({
      version: `4.0.1`,
      name: `test dependency`,
      repoUrl: null,
      repoDirectory: null,
      commitSha: null,
      releaseDate: null,
      engines: null,
      testScript: null,
      buildScript: null,
    });
    const commitSha = `commitSha`;
    await packageInfoCache.updateCommitSha({
      dependencyVersion,
      commitSha,
    });
    expect(dependencyVersion.commitSha).toBe(commitSha);
    expect(repositoryMock.update).toBeCalledTimes(1);
    expect(repositoryMock.update).toBeCalledWith(
      {
        version: `4.0.1`,
        name: `test dependency`,
      },
      {
        commitSha,
      }
    );
  });

  it(`Should update test script`, async () => {
    const dependencyVersion = new DependencyVersion({
      version: `4.0.1`,
      name: `test dependency`,
      repoUrl: null,
      repoDirectory: null,
      commitSha: null,
      releaseDate: null,
      engines: null,
      testScript: null,
      buildScript: null,
    });
    const testScript = `test:unit`;
    await packageInfoCache.updateTestScript({
      dependencyVersion,
      testScript,
    });
    expect(dependencyVersion.testScript).toBe(testScript);
    expect(repositoryMock.update).toBeCalledTimes(1);
    expect(repositoryMock.update).toBeCalledWith(
      {
        version: `4.0.1`,
        name: `test dependency`,
      },
      {
        testScript,
      }
    );
  });

  it(`Should update repository directory`, async () => {
    const dependencyVersion = new DependencyVersion({
      version: `4.0.1`,
      name: `test dependency`,
      repoUrl: null,
      repoDirectory: null,
      commitSha: null,
      releaseDate: null,
      engines: null,
      testScript: null,
      buildScript: null,
    });
    const repoDirectory = `dir1/dir2`;
    await packageInfoCache.updateRepoDirectory({
      dependencyVersion,
      repoDirectory,
    });
    expect(dependencyVersion.repoDirectory).toBe(repoDirectory);
    expect(repositoryMock.update).toBeCalledTimes(1);
    expect(repositoryMock.update).toBeCalledWith(
      {
        version: `4.0.1`,
        name: `test dependency`,
      },
      {
        repoDirectory,
      }
    );
  });

  it(`Should update build script`, async () => {
    const dependencyVersion = new DependencyVersion({
      version: `4.0.1`,
      name: `test dependency`,
      repoUrl: null,
      repoDirectory: null,
      commitSha: null,
      releaseDate: null,
      engines: null,
      testScript: null,
      buildScript: null,
    });
    const buildScript = `dir1/dir2`;
    await packageInfoCache.updateBuildScript({
      dependencyVersion,
      buildScript,
    });
    expect(dependencyVersion.buildScript).toBe(buildScript);
    expect(repositoryMock.update).toBeCalledTimes(1);
    expect(repositoryMock.update).toBeCalledWith(
      {
        version: `4.0.1`,
        name: `test dependency`,
      },
      {
        buildScript,
      }
    );
  });
});
