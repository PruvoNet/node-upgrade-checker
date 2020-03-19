import { ICIResolveOptions, ICIResolver } from '../interfaces/cIResolver';
import { injectable, multiInject } from 'inversify';
import { ISpecificCIResolver } from '../interfaces/specificCIResolver';
import { ITargetMatcher } from '../interfaces/targetMatcher';
import { IResolverResult } from '../../types';

@injectable()
export class CiResolver extends ICIResolver {
  constructor(
    @multiInject(ISpecificCIResolver) private resolvers: ISpecificCIResolver[],
    private targetMatcher: ITargetMatcher
  ) {
    super();
  }

  async resolve({ repoPath, targetNode, packageReleaseDate }: ICIResolveOptions): Promise<IResolverResult> {
    for (const resolver of this.resolvers) {
      let nodeVersions: string[] | undefined;
      try {
        nodeVersions = await resolver.resolve({
          repoPath,
        });
      } catch (e) {
        console.log(`Failed to find node versions in resolver ${resolver.resolverName} due to an unknown error`, e);
      }
      if (nodeVersions) {
        if (nodeVersions.length === 0) {
          console.log(`Failed to find node versions in resolver ${resolver.resolverName}`);
        } else {
          const isMatch = await this.targetMatcher.match({
            candidates: nodeVersions,
            targetNode,
            packageReleaseDate,
          });
          if (isMatch) {
            return {
              isMatch: true,
              resolverName: resolver.resolverName,
            };
          }
        }
      }
    }
    return {
      isMatch: false,
    };
  }
}
