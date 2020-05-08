import { injectable } from 'inversify';
import { ICacheResolver, ICacheResolverOptions, ICacheResolverResult } from '../interfaces/ICacheResolver';
import { IDependencyRepositoryProvider } from '../../../db';
import { ILoggerFactory, ILogger } from '../../../utils/logger';

@injectable()
export class CacheResolver extends ICacheResolver {
  private readonly logger: ILogger;
  constructor(
    private readonly dependencyRepositoryProvider: IDependencyRepositoryProvider,
    loggerFactory: ILoggerFactory
  ) {
    super();
    this.logger = loggerFactory.getLogger(`Cache Resolver`);
  }

  public async resolve({ repo, targetNode }: ICacheResolverOptions): Promise<ICacheResolverResult> {
    try {
      this.logger.info(`Checking if there are cached results for ${repo.name}@$${repo.version}`);
      const dependencyRepository = await this.dependencyRepositoryProvider.getRepository();
      const dependency = await dependencyRepository.findOne({
        name: repo.name,
        version: repo.version,
        targetNode,
      });
      if (dependency) {
        this.logger.info(`Located cached results for ${repo.name}@$${repo.version}`);
        if (dependency.match) {
          return {
            isMatch: true,
            result: true,
            resolverName: `${dependency.reason} (cache)`,
          };
        } else {
          return {
            isMatch: true,
            result: false,
          };
        }
      } else {
        this.logger.info(`No cached results for ${repo.name}@$${repo.version}`);
        return {
          isMatch: false,
        };
      }
    } catch (err) {
      this.logger.error(`Failed to locate cached results for ${repo.name}@$${repo.version}`, err);
      return {
        isMatch: false,
      };
    }
  }
}
