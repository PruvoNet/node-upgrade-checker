import {container} from '../../../../../src/container';
import {IPackageInfo} from '../../../../../src/utils/packageInfo';

describe('npm', () => {

    let packageInfo: IPackageInfo;

    beforeEach(() => {
        container.snapshot();
        packageInfo = container.get(IPackageInfo);
    });

    afterEach(() => {
        container.restore();
    });

    it('should perform full npm test flow', async () => {
        const result = await packageInfo.getPackageInfo({
            name: 'squiss-ts',
            semver: '^3.0.0',
        });
        expect(result).toEqual({
            name: 'squiss-ts',
            semver: '^3.0.0',
            version: '3.0.1',
            engines: '>=6',
            repoUrl: 'git+https://github.com/PruvoNet/squiss-ts.git',
            commitSha: '5cd3e98b5236ce93bb522a893a7e09fd4de1e39b',
        });
    });

});
