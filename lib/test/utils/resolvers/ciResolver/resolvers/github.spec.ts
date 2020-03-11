import * as path from 'path';
import {githubActionsResolver} from '../../../../../utils/resolvers/ciResolver/resolvers/github';
import {should} from 'chai';
import {resourcesDir} from '../../../../common';

describe('github actions', () => {

    it('should expose the proper name', async () => {
        githubActionsResolver.resolverName.should.eql('githubActions');
    });

    it('should resolve node js from github actions configuration', async () => {
        const repoPath = path.join(resourcesDir, 'github');
        const versions = await githubActionsResolver({
            repoPath,
        });
        should().exist(versions);
        versions?.should.eql(['8.x', '12.x', '6', '10.x', '4.x']);
    });

    it('should return empty array from faulty configuration', async () => {
        const repoPath = path.join(resourcesDir, 'githubFaulty');
        const versions = await githubActionsResolver({
            repoPath,
        });
        should().exist(versions);
        versions?.should.eql([]);
    });

    it('should return undefined from non relevant repo', async () => {
        const repoPath = path.join(resourcesDir, 'empty');
        const versions = await githubActionsResolver({
            repoPath,
        });
        should().not.exist(versions);
    });

});
