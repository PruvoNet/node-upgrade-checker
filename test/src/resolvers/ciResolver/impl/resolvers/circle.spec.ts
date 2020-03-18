import * as path from 'path';
import {resourcesDir} from '../../../../../common';
import {container} from '../../../../../../src/container';
import {CircleCiResolver} from '../../../../../../src/resolvers/ciResolver/impl/resolvers/circle';

describe(`circle ci`, () => {

    let circleCiResolver: CircleCiResolver;

    beforeEach(() => {
        container.snapshot();
        circleCiResolver = container.get(CircleCiResolver);
    });

    afterEach(() => {
        container.restore();
    });

    it(`should expose the proper name`, async () => {
        expect(circleCiResolver.resolverName).toBe(`circleCi`);
    });

    it(`should resolve node js from circleci configuration`, async () => {
        const repoPath = path.join(resourcesDir, `circleci`);
        const versions = await circleCiResolver.resolve({
            repoPath,
        });
        expect(versions).toEqual([`10`]);
    });

    it(`should resolve node js from circleci configuration multiple nodes`, async () => {
        const repoPath = path.join(resourcesDir, `circleci2`);
        const versions = await circleCiResolver.resolve({
            repoPath,
        });
        expect(versions).toEqual([`6`, `8`, `10`, `11`]);
    });

    it(`should return empty array from faulty configuration`, async () => {
        const repoPath = path.join(resourcesDir, `circleciFaulty`);
        const versions = await circleCiResolver.resolve({
            repoPath,
        });
        expect(versions).toEqual([]);
    });

    it(`should return undefined from non relevant repo`, async () => {
        const repoPath = path.join(__dirname, `..`, `..`, `..`, `resources`, `empty`);
        const versions = await circleCiResolver.resolve({
            repoPath,
        });
        expect(versions).toBeFalsy();
    });

});
