import { inject, injectable } from 'inversify';
import { IPackageInfo, IPackageInfoOptions, IPackageInfoResult } from '../interfaces/packageInfo';
import { Pacote, TYPES } from '../../../container/nodeModulesContainer';

@injectable()
export class PackageInfo extends IPackageInfo {
  constructor(@inject(TYPES.Pacote) private pacote: Pacote) {
    super();
  }

  async getPackageInfo({ name, semver }: IPackageInfoOptions): Promise<IPackageInfoResult> {
    const result = await this.pacote.manifest(`${name}@${semver}`, {
      fullMetadata: true,
    });
    const version = result.version;
    const engines = result.engines?.node;
    const repoUrl = (result.repository as any)?.url;
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
