import { injectable } from 'inversify';
import { IPackageInfo } from '../../utils/packageInfo';
import { ILogger, ILoggerFactory } from '../../utils/logger';
import { DependencyVersion, IDependencyVersionRepositoryProvider } from '../../db';
import {
  IPackageInfoCache,
  IPackageInfoCacheOptions,
  IUpdateBuildScriptOptions,
  IUpdateCommitShaOptions,
  IUpdateRepoDirectoryOptions,
  IUpdateTestScriptOptions,
} from '../interfaces/IPackageInfoCache';
import { memoize } from '../../utils/memoize/memoize';

const keyBuilder = ({ name, semver }: IPackageInfoCacheOptions): string => {
  return `${name}@${semver}`;
};

@injectable()
export class PackageInfoCache extends IPackageInfoCache {
  private readonly logger: ILogger;

  constructor(
    private readonly packageInfo: IPackageInfo,
    private readonly dependencyVersionRepositoryProvider: IDependencyVersionRepositoryProvider,
    loggerFactory: ILoggerFactory
  ) {
    super();
    this.logger = loggerFactory.getLogger(`Package Info Cache`);
  }

  @memoize(keyBuilder)
  public async getPackageInfo({ name, semver }: IPackageInfoCacheOptions): Promise<DependencyVersion> {
    this.logger.info(`Checking if package info is cached ${name}@$${semver}`);
    const version = await this.packageInfo.resolvePackageVersion({
      semver,
      name,
    });
    this.logger.info(`Resolved package version is ${name}@$${version}`);
    const dependencyVersionRepository = await this.dependencyVersionRepositoryProvider.getRepository();
    try {
      const cachedDependencyVersion = await dependencyVersionRepository.findOne({
        name,
        version,
      });
      if (cachedDependencyVersion) {
        this.logger.info(`Located cached package info for ${name}@$${version}`);
        return cachedDependencyVersion;
      } else {
        this.logger.info(`No cached package info for ${name}@$${version}`);
      }
    } catch (err) {
      this.logger.error(`Failed to locate cached package info for ${name}@$${version}`, err);
    }
    this.logger.debug(`Locating package info for ${name}@$${version}`);
    const packageInfo = await this.packageInfo.getPackageInfo({
      version,
      name,
    });
    const dependencyVersion = new DependencyVersion({
      ...packageInfo,
      engines: packageInfo.engines || null,
      commitSha: packageInfo.commitSha || null,
      releaseDate: packageInfo.releaseDate || null,
      repoUrl: packageInfo.repoUrl || null,
      repoDirectory: packageInfo.repoDirectory || null,
      testScript: null,
      buildScript: null,
    });
    this.logger.debug(`Saving package info for ${name}@$${version} in cache`);
    await dependencyVersionRepository.save(dependencyVersion);
    return dependencyVersion;
  }

  public async updateCommitSha({ commitSha, dependencyVersion }: IUpdateCommitShaOptions): Promise<void> {
    dependencyVersion.commitSha = commitSha;
    await this.updateEntity(dependencyVersion, {
      commitSha,
    });
  }

  public async updateTestScript({ testScript, dependencyVersion }: IUpdateTestScriptOptions): Promise<void> {
    dependencyVersion.testScript = testScript;
    await this.updateEntity(dependencyVersion, {
      testScript,
    });
  }

  public async updateRepoDirectory({ repoDirectory, dependencyVersion }: IUpdateRepoDirectoryOptions): Promise<void> {
    dependencyVersion.repoDirectory = repoDirectory;
    await this.updateEntity(dependencyVersion, {
      repoDirectory,
    });
  }

  public async updateBuildScript({ buildScript, dependencyVersion }: IUpdateBuildScriptOptions): Promise<void> {
    dependencyVersion.buildScript = buildScript;
    await this.updateEntity(dependencyVersion, {
      buildScript,
    });
  }

  private async updateEntity(
    dependencyVersion: DependencyVersion,
    updateObject: Partial<DependencyVersion>
  ): Promise<void> {
    this.logger.debug(`Updating package info ${dependencyVersion.name}@$${dependencyVersion.version}`);
    const dependencyVersionRepository = await this.dependencyVersionRepositoryProvider.getRepository();
    await dependencyVersionRepository.update(
      {
        name: dependencyVersion.name,
        version: dependencyVersion.version,
      },
      updateObject
    );
    this.logger.debug(`Done updating package info ${dependencyVersion.name}@$${dependencyVersion.version}`);
  }
}
