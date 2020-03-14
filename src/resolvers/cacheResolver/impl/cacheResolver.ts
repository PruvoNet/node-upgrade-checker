import {injectable} from 'inversify';
import {ICacheResolver, ICacheResolverOptions, ICacheResolverResult} from '../interfaces/cacheResolver';
import {IDependencyRepositoryProvider} from '../../../db';

@injectable()
export class CacheResolver extends ICacheResolver {

    constructor(private dependencyRepositoryProvider: IDependencyRepositoryProvider) {
        super();
    }

    public async resolve({repo, targetNode}: ICacheResolverOptions): Promise<ICacheResolverResult> {
        try {
            const dependencyRepository = await this.dependencyRepositoryProvider.getRepository();
            const dependency = await dependencyRepository.findOne({
                name: repo.name,
                version: repo.version,
                targetNode,
            });
            if (dependency && dependency.match) {
                return {
                    isMatch: true,
                    resolverName: `${dependency.reason} (cache)`,
                };
            }
        } catch (e) {
        }
        return {
            isMatch: false,
        };
    }
}
