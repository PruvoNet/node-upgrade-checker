import {TravisCiResolver} from '../../../../../../src/resolvers/ciResolver/impl/resolvers/travis';
import * as path from 'path';
import {resourcesDir} from '../../../../../common';
import {container} from '../../../../../../src/container';
import {LTS_VERSION} from '../../../../../../src/resolvers/ciResolver';

describe(`travis ci`, () => {

    let travisCiResolver: TravisCiResolver;

    beforeEach(() => {
        container.snapshot();
        travisCiResolver = container.get(TravisCiResolver);
    });

    afterEach(() => {
        container.restore();
    });

    it(`should expose the proper name`, async () => {
        expect(travisCiResolver.resolverName).toBe(`travisCi`);
    });

    it(`should resolve node js from travis configuration`, async () => {
        const repoPath = path.join(resourcesDir, `travis`);
        const versions = await travisCiResolver.resolve({
            repoPath,
        });
        expect(versions).toEqual([`6`, `7`, `8`, `9`, `10`]);
    });

    it(`should resolve lts version`, async () => {
        const repoPath = path.join(resourcesDir, `travisLts`);
        const versions = await travisCiResolver.resolve({
            repoPath,
        });
        expect(versions).toEqual([LTS_VERSION]);
    });

    it(`should throw due to faulty configuration`, async () => {
        const repoPath = path.join(resourcesDir, `travisFaulty`);
        const promise = travisCiResolver.resolve({
            repoPath,
        });
        await expect(promise).rejects.toBeInstanceOf(Error);
    });

    it(`should return undefined from non relevant repo`, async () => {
        const repoPath = path.join(resourcesDir, `empty`);
        const versions = await travisCiResolver.resolve({
            repoPath,
        });
        expect(versions).toBeFalsy();
    });

});
