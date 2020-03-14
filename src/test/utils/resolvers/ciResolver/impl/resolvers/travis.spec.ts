import {TravisCiResolver} from '../../../../../../utils/resolvers/ciResolver/impl/resolvers/travis';
import * as path from 'path';
import {should} from 'chai';
import {resourcesDir} from '../../../../../common';
import {container} from '../../../../../../container';

describe('travis ci', () => {

    let travisCiResolver: TravisCiResolver;

    beforeEach(() => {
        container.snapshot();
        travisCiResolver = container.get(TravisCiResolver);
    });

    afterEach(() => {
        container.restore();
    });

    it('should expose the proper name', async () => {
        travisCiResolver.resolverName.should.eql('travisCi');
    });

    it('should resolve node js from travis configuration', async () => {
        const repoPath = path.join(resourcesDir, 'travis');
        const versions = await travisCiResolver.resolve({
            repoPath,
        });
        should().exist(versions);
        versions?.should.eql(['6', '7', '8', '9', '10']);
    });

    it('should return empty array from faulty configuration', async () => {
        const repoPath = path.join(resourcesDir, 'travisFaulty');
        const versions = await travisCiResolver.resolve({
            repoPath,
        });
        should().exist(versions);
        versions?.should.eql([]);
    });

    it('should return undefined from non relevant repo', async () => {
        const repoPath = path.join(resourcesDir, 'empty');
        const versions = await travisCiResolver.resolve({
            repoPath,
        });
        should().not.exist(versions);
    });

});
