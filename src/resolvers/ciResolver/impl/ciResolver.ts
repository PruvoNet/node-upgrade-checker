import { ICIResolveOptions, ICIResolver } from '../interfaces/ICIResolver';
import { injectable, multiInject } from 'inversify';
import { ISpecificCIResolver } from '../interfaces/ISpecificCIResolver';
import { IResolverResult } from '../../types';
import { ILoggerFactory } from '../../../utils/logger';
import { ILogger } from '../../../utils/logger/interfaces/ILogger';
import { asyncFilter } from '../../../utils/asyncFilter/asyncFilter';
import { ISpecificCIResolverRunner } from '../interfaces/ISpecificCIResolverRunner';

@injectable()
export class CiResolver extends ICIResolver {
  private readonly logger: ILogger;

  constructor(
    @multiInject(ISpecificCIResolver) private readonly resolvers: ISpecificCIResolver[],
    private readonly specificCIResolverRunner: ISpecificCIResolverRunner,
    loggerFactory: ILoggerFactory
  ) {
    super();
    this.logger = loggerFactory.getLogger(`Ci Resolver`);
  }

  public async resolve({ repoPath, targetNode, packageReleaseDate }: ICIResolveOptions): Promise<IResolverResult> {
    this.logger.debug(
      `Checking if repo in ${repoPath} has a ci that uses node ${targetNode} (package release date is ${packageReleaseDate.toJSON()})`
    );
    this.logger.debug(`Trying to find relevant resolvers from ${this.resolvers.length} resolvers`);
    const resolverOptions = {
      repoPath,
    };
    const relevantResolvers = await asyncFilter(this.resolvers, (resolver) => resolver.isRelevant(resolverOptions));
    this.logger.debug(`Found ${relevantResolvers.length} relevant resolver(s). Will run each`);
    const relevantResolversResults = await Promise.all(
      relevantResolvers.map((resolver) =>
        this.specificCIResolverRunner.resolve({ repoPath, targetNode, packageReleaseDate, resolver })
      )
    );
    const relevantResults = relevantResolversResults
      .flatMap((result) => (result.isMatch ? [result] : []))
      .map((result) => result.resolverName);
    this.logger.debug(`Found ${relevantResults.length} matching resolvers(s) - ${JSON.stringify(relevantResults)}`);
    const resolverName = relevantResults[0];
    return { isMatch: Boolean(resolverName), resolverName };
  }
}
