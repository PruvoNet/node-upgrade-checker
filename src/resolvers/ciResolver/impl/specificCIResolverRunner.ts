import { injectable } from 'inversify';
import { ITargetMatcher } from '../interfaces/ITargetMatcher';
import { IResolverResult } from '../../types';
import { ILoggerFactory } from '../../../utils/logger';
import { ILogger } from '../../../utils/logger/interfaces/ILogger';
import { ISpecificCIResolverRunner, ISpecificCIResolverRunnerOptions } from '../interfaces/ISpecificCIResolverRunner';

@injectable()
export class SpecificCIResolverRunner extends ISpecificCIResolverRunner {
  private readonly logger: ILogger;

  constructor(private readonly targetMatcher: ITargetMatcher, loggerFactory: ILoggerFactory) {
    super();
    this.logger = loggerFactory.getLogger(`Specific Ci Resolver Runner`);
  }

  public async resolve({
    repoPath,
    targetNode,
    packageReleaseDate,
    resolver,
  }: ISpecificCIResolverRunnerOptions): Promise<IResolverResult> {
    const result: IResolverResult = {
      isMatch: false,
    };
    let nodeVersions: Set<string>;
    try {
      this.logger.debug(`Trying to resolve using ${resolver.resolverName}`);
      const resolverResult = await resolver.resolve({
        repoPath,
      });
      nodeVersions = resolverResult.nodeVersions;
    } catch (e) {
      this.logger.debug(`Failed to find node versions in resolver ${resolver.resolverName} due to an unknown error`, e);
      return result;
    }
    if (nodeVersions.size === 0) {
      this.logger.debug(`No node versions were found in resolver ${resolver.resolverName}`);
      return result;
    } else {
      this.logger.debug(`Resolver ${resolver.resolverName} found ${nodeVersions.size} node versions`);
      const isMatch = await this.targetMatcher.match({
        candidates: nodeVersions,
        targetNode,
        packageReleaseDate,
      });
      if (isMatch) {
        this.logger.debug(`Resolver ${resolver.resolverName} found a matching node version`);
        return {
          isMatch: true,
          resolverName: resolver.resolverName,
        };
      } else {
        this.logger.debug(`Resolver ${resolver.resolverName} did not find a matching node version`);
        return result;
      }
    }
  }
}
