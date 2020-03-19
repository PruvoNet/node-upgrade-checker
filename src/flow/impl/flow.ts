import { injectable } from 'inversify';
import { IFlow, IRunFlowOptions, IRunFlowResult } from '../interfaces/flow';
import { IGitCheckout } from '../../utils/git';
import { ICacheResolver } from '../../resolvers/cacheResolver';
import { ICIResolver } from '../../resolvers/ciResolver';
import { ITestResolver } from '../../resolvers/testResolver';

@injectable()
export class Flow extends IFlow {
  constructor(
    private gitCheckout: IGitCheckout,
    private cacheResolver: ICacheResolver,
    private ciResolver: ICIResolver,
    private testResolver: ITestResolver
  ) {
    super();
  }

  public async runFlow({ repo, targetNode, pkg, nvmBinDir, workDir }: IRunFlowOptions): Promise<IRunFlowResult> {
    const cacheResult = await this.cacheResolver.resolve({
      targetNode,
      repo: {
        name: pkg.name,
        version: pkg.version,
      },
    });
    if (cacheResult.isMatch) {
      return {
        isMatch: true,
        resolverName: cacheResult.resolverName,
      };
    }
    const repoPath = await this.gitCheckout.checkoutRepo({
      tag: pkg.version,
      commitSha: repo.commitSha,
      baseDir: workDir,
      url: repo.url,
    });
    const ciResult = await this.ciResolver.resolve({
      targetNode,
      repoPath,
      packageReleaseDate: pkg.releaseDate,
    });
    if (ciResult.isMatch) {
      return {
        isMatch: true,
        resolverName: cacheResult.resolverName,
      };
    }
    const testResult = await this.testResolver.resolve({
      repoPath,
      nvmBinDir,
    });
    if (testResult.isMatch) {
      return {
        isMatch: true,
        resolverName: cacheResult.resolverName,
      };
    }
    return {
      isMatch: false,
    };
  }
}
