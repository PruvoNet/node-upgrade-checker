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
import { ILogger, ILoggerFactory } from '../../utils/logger';
import { IPackageInfoCache } from '..';

@injectable()
export class DependencyChecker extends IDependencyChecker {
  private readonly logger: ILogger;

  constructor(
    private readonly gitCheckout: IGitCheckout,
    private readonly cacheResolver: ICacheResolver,
    private readonly ciResolver: ICIResolver,
    private readonly testResolver: ITestResolver,
    private readonly engineResolver: IEnginesResolver,
    private readonly packageInfoCache: IPackageInfoCache,
    loggerFactory: ILoggerFactory
  ) {
    super();
    this.logger = loggerFactory.getLogger(`Dependency Checker`);
  }

  public async run({
    targetNode,
    pkg,
    workDir,
    skip,
  }: IDependencyCheckerRunOptions): Promise<IDependencyCheckerRunResult> {
    this.logger.info(`Checking ${pkg.dependencyType} dependency - ${pkg.name}@${pkg.semver}`);
    const dependencyVersion = await this.packageInfoCache.getPackageInfo({
      semver: pkg.semver,
      name: pkg.name,
    });
    if (!skip.cache.ignoreAll) {
      const cacheResult = await this.cacheResolver.resolve({
        targetNode,
        repo: {
          name: pkg.name,
          version: dependencyVersion.version,
        },
      });
      if (cacheResult.isMatch) {
        if (cacheResult.result) {
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
    const engineResult = await this.engineResolver.resolve({
      targetNode,
      engines: dependencyVersion.engines || undefined,
      releaseDate: dependencyVersion.releaseDate || undefined,
    });
    if (engineResult.isMatch) {
      return {
        isMatch: true,
        resolverName: engineResult.resolverName,
      };
    }
    if (!dependencyVersion.repoUrl) {
      const reason = `Failed to get repository url for ${pkg.dependencyType} dependency - ${pkg.name}@${dependencyVersion.version}`;
      this.logger.error(reason);
      return {
        isError: true,
        reason,
      };
    }
    if (!dependencyVersion.releaseDate) {
      const reason = `Failed to get package release date for ${pkg.dependencyType} dependency - ${pkg.name}@${dependencyVersion.version}`;
      this.logger.error(reason);
      return {
        isError: true,
        reason,
      };
    }
    const { repoPath, commitSha } = await this.gitCheckout.checkoutRepo({
      tag: dependencyVersion.version,
      commitSha: dependencyVersion.commitSha || undefined,
      baseDir: workDir,
      url: dependencyVersion.repoUrl,
    });
    if (!dependencyVersion.commitSha) {
      await this.packageInfoCache.updateCommitSha({
        dependencyVersion,
        commitSha,
      });
    }
    const ciResult = await this.ciResolver.resolve({
      targetNode,
      repoPath,
      packageReleaseDate: dependencyVersion.releaseDate,
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
