import * as path from 'path';
import {
    GithubActionsResolver,
} from '../../../../../../../utils/resolvers/ciResolver/impl/resolvers/github';
import {should} from 'chai';
import {resourcesDir} from '../../../../../../common';
import {container} from '../../../../../../../container';

describe('github actions', () => {


    let githubActionsResolver: GithubActionsResolver;

    beforeEach(() => {
        container.snapshot();
        githubActionsResolver = container.get(GithubActionsResolver);
    });

    afterEach(() => {
        container.restore();
    });

    it('should expose the proper name', async () => {
        githubActionsResolver.resolverName.should.eql('githubActions');
    });

    it('should resolve node js from github actions configuration', async () => {
        const repoPath = path.join(resourcesDir, 'github');
        const versions = await githubActionsResolver.resolve({
            repoPath,
        });
        should().exist(versions);
        versions?.should.eql(['8.x', '12.x', '6', '10.x', '4.x']);
    });

    it('should return empty array from faulty configuration', async () => {
        const repoPath = path.join(resourcesDir, 'githubFaulty');
        const versions = await githubActionsResolver.resolve({
            repoPath,
        });
        should().exist(versions);
        versions?.should.eql([]);
    });

    it('should return undefined from non relevant repo', async () => {
        const repoPath = path.join(resourcesDir, 'empty');
        const versions = await githubActionsResolver.resolve({
            repoPath,
        });
        should().not.exist(versions);
    });

});
