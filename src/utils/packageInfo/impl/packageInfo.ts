import { inject, injectable } from 'inversify';
import { IPackageInfo, IPackageInfoOptions, IPackageInfoResult } from '../interfaces/IPackageInfo';
import { Pacote, TYPES } from '../../../container/nodeModulesContainer';
import { ILoggerFactory } from '../../logger';
import { ILogger } from '../../logger/interfaces/ILogger';

@injectable()
export class PackageInfo extends IPackageInfo {
  private readonly logger: ILogger;

  constructor(@inject(TYPES.Pacote) private readonly pacote: Pacote, loggerFactory: ILoggerFactory) {
    super();
    this.logger = loggerFactory.getLogger(`Package Info`);
  }

  async getPackageInfo({ name, semver }: IPackageInfoOptions): Promise<IPackageInfoResult> {
    this.logger.info(`Getting package information of ${name}@${semver}`);
    const result = await this.pacote.manifest(`${name}@${semver}`, {
      fullMetadata: true,
    });
    this.logger.debug(`Got package information of ${name}@${semver}`);
    const version = result.version;
    const engines = result.engines?.node;
    const repoUrl = result.repository?.url;
    const commitSha = result.gitHead as string;
    return {
      name,
      semver,
      version,
      engines,
      repoUrl,
      commitSha,
    };
  }
}
