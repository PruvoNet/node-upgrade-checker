import {AppVeyorResolver} from '../../../../../../src/resolvers/ciResolver/impl/resolvers/appveyor';
import * as path from 'path';
import {resourcesDir} from '../../../../../common';
import {container} from '../../../../../../src/container';

describe('appveyor', () => {

    let appVeyorResolver: AppVeyorResolver;

    beforeEach(() => {
        container.snapshot();
        appVeyorResolver = container.get(AppVeyorResolver);
    });

    afterEach(() => {
        container.restore();
    });

    it('should expose the proper name', async () => {
        expect(appVeyorResolver.resolverName).toBe('appVeyor');
    });

    it('should resolve node js from travis configuration matrix', async () => {
        const repoPath = path.join(resourcesDir, 'appveyor');
        const versions = await appVeyorResolver.resolve({
            repoPath,
        });
        expect(versions).toEqual(['4', '6', '1.0']);
    });

    it('should resolve node js from travis configuration', async () => {
        const repoPath = path.join(resourcesDir, 'appveyor2');
        const versions = await appVeyorResolver.resolve({
            repoPath,
        });
        expect(versions).toEqual(['8']);
    });

    it('should throw due to faulty configuration', async () => {
        const repoPath = path.join(resourcesDir, 'appveyorFaulty');
        expect.assertions(1);
        try {
            await appVeyorResolver.resolve({
                repoPath,
            });
        } catch(e) {
            expect(e).toBeInstanceOf(Error);
        }
    });

    it('should return undefined from non relevant repo', async () => {
        const repoPath = path.join(resourcesDir, 'empty');
        const versions = await appVeyorResolver.resolve({
            repoPath,
        });
        expect(versions).toBeFalsy();
    });

});
