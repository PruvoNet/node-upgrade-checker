import {ICIResolver} from './types';
import {travisCiResolver} from './resolvers/travis';
import {targetMatcher} from './targetMatcher';
import {circleCiResolver} from './resolvers/circle';
import {githubActionsResolver} from './resolvers/github';

const resolvers: ICIResolver[] = [travisCiResolver, circleCiResolver, githubActionsResolver];

export interface ICIResolveOptions {
    repoPath: string;
    targetNode: string;
}

export interface ICIResolveResult {
    isMatch: boolean;
    resolverName?: string;
}

export const ciResolve = async ({repoPath, targetNode}: ICIResolveOptions): Promise<ICIResolveResult> => {
    for (const resolver of resolvers) {

        const nodeVersions = await resolver({
            repoPath,
        });
        if (nodeVersions) {
            if (nodeVersions.length === 0) {
                console.log(`Failed to find node versions in resolver ${resolver.resolverName}`);
                continue;
            }
            const isMatch = await targetMatcher({
                candidates: nodeVersions,
                targetNode,
            });
            if (isMatch) {
                return {
                    isMatch: true,
                    resolverName: resolver.resolverName,
                };
            }
        }
    }
    return {
        isMatch: false,
    };
};
