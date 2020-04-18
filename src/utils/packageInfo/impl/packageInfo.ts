import { inject, injectable } from 'inversify';
import {
  IPackageInfo,
  IPackageInfoOptions,
  IPackageInfoResult,
  IPackageVersionOptions,
} from '../interfaces/IPackageInfo';
import { Pacote, TYPES } from '../../../container/nodeModulesContainer';
import { ILoggerFactory } from '../../logger';
import { ILogger } from '../../logger/interfaces/ILogger';
import moment = require('moment');
import { memoize } from '../../memoize/memoize';

@injectable()
export class PackageInfo extends IPackageInfo {
  private readonly logger: ILogger;

  constructor(@inject(TYPES.Pacote) private readonly pacote: Pacote, loggerFactory: ILoggerFactory) {
    super();
    this.logger = loggerFactory.getLogger(`Package Info`);
  }

  @memoize(({ name, semver }: IPackageVersionOptions): string => {
    return `${name}@${semver}`;
  })
  public async resolvePackageVersion({ name, semver }: IPackageVersionOptions): Promise<string> {
    this.logger.info(`Resolving version of package ${name}@${semver}`);
    const manifest = await this.pacote.manifest(`${name}@${semver}`, {
      fullMetadata: false,
    });
    return manifest.version;
  }

  @memoize(({ name, version }: IPackageInfoOptions): string => {
    return `${name}@${version}`;
  })
  async getPackageInfo({ name, version }: IPackageInfoOptions): Promise<IPackageInfoResult> {
    this.logger.info(`Getting package information of ${name}@${version}`);
    const packument = await this.pacote.packument(name, {
      fullMetadata: true,
    });
    this.logger.debug(`Got package information of ${name}@${version}`);
    const releaseDateStr = packument.time?.[version];
    let releaseDate = releaseDateStr ? moment.utc(releaseDateStr) : undefined;
    if (releaseDate && releaseDate.isValid()) {
      this.logger.debug(`Got package release date - ${releaseDate.toJSON()}`);
    } else {
      releaseDate = undefined;
    }
    const manifest = packument.versions[version];
    const engines = manifest.engines?.node;
    const repoUrl = manifest.repository?.url;
    const repoDirectory = manifest.repository?.directory;
    const commitSha = manifest.gitHead as string;
    return {
      name,
      version,
      engines,
      repoUrl,
      repoDirectory,
      commitSha,
      releaseDate,
    };
  }
}
