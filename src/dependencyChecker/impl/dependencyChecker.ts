import { injectable } from 'inversify';
import {
  IDependencyChecker,
  IDependencyCheckerRunOptions,
  IDependencyCheckerRunResult,
} from '../interfaces/IDependencyChecker';
import { IGitCheckout } from '../../utils/git';
import { ICacheResolver } from '../../resolvers/cacheResolver';
import { ICIResolver } from '../../resolvers/ciResolver';
import { ITestResolver } from '../../resolvers/testResolver';
import { IEnginesResolver } from '../../resolvers/enginesResolver';
import { IPackageInfo } from '../../utils/packageInfo';
import { ILoggerFactory } from '../../utils/logger';
import { ILogger } from '../../utils/logger/interfaces/ILogger';

@injectable()
export class DependencyChecker extends IDependencyChecker {
  private readonly logger: ILogger;

  constructor(
    private readonly gitCheckout: IGitCheckout,
    private readonly cacheResolver: ICacheResolver,
    private readonly ciResolver: ICIResolver,
    private readonly testResolver: ITestResolver,
    private readonly engineResolver: IEnginesResolver,
    private readonly packageInfo: IPackageInfo,
    loggerFactory: ILoggerFactory
  ) {
    super();
    this.logger = loggerFactory.getLogger(`Dependency Checker`);
  }

  public async run({
    repo,
    targetNode,
    pkg,
    workDir,
    skip,
  }: IDependencyCheckerRunOptions): Promise<IDependencyCheckerRunResult> {
    this.logger.info(`Checking ${pkg.dependencyType} dependency - ${pkg.name}@${pkg.version}`);
    if (!skip.cache.ignoreAll) {
      const cacheResult = await this.cacheResolver.resolve({
        targetNode,
        repo: {
          name: pkg.name,
          version: pkg.version,
        },
      });
      if (cacheResult.isMatch) {
        if (cacheResult.result && !skip.cache.ignoreTruthy) {
          return {
            isMatch: true,
            resolverName: cacheResult.resolverName,
          };
        } else if (!cacheResult.result && !skip.cache.ignoreFalsy) {
          return {
            isMatch: false,
          };
        }
      }
    }
    // TODO get packageInfo from cache, probably we should move all this logic to a different unit
    const packageInfo = await this.packageInfo.getPackageInfo({
      semver: pkg.version,
      name: pkg.name,
    });
    const engineResult = await this.engineResolver.resolve({
      targetNode,
      engines: packageInfo.engines,
    });
    if (engineResult.isMatch) {
      return {
        isMatch: true,
        resolverName: engineResult.resolverName,
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
        resolverName: ciResult.resolverName,
      };
    }
    if (!skip.yarnTest) {
      const testResult = await this.testResolver.resolve({
        repoPath,
      });
      if (testResult.isMatch) {
        return {
          isMatch: true,
          resolverName: testResult.resolverName,
        };
      }
    }
    return {
      isMatch: false,
    };
  }
}
