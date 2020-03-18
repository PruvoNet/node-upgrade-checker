import Mock = jest.Mock;
import {PackageInfo} from '../../../../../src/utils/packageInfo/impl/packageInfo';
import {Pacote} from '../../../../../src/container/nodeModulesContainer';

describe('package info', () => {

    let packageInfo: PackageInfo;
    let manifestMock: Mock;

    beforeEach(() => {
        manifestMock = jest.fn();
        const pacoteSpy = {
            manifest: manifestMock,
        } as any as Pacote;
        packageInfo = new PackageInfo(pacoteSpy);
    });

    it('should resolve package info properly', async () => {
        manifestMock.mockResolvedValue({
            version: '3.0.1',
            engines: {
                node: '>=6',
            },
            repository: {
                url: 'git+https://github.com/PruvoNet/squiss-ts.git',
            },
            gitHead: '5cd3e98b5236ce93bb522a893a7e09fd4de1e39b',
        });
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
        expect(manifestMock.mock.calls.length).toBe(1);
        expect(manifestMock.mock.calls[0].length).toBe(2);
        expect(manifestMock.mock.calls[0][0]).toBe('squiss-ts@^3.0.0');
    });

    it('should resolve package info properly when no repo data', async () => {
        manifestMock.mockResolvedValue({
            version: '3.0.1',
            engines: {
                node: '>=6',
            },
            gitHead: '5cd3e98b5236ce93bb522a893a7e09fd4de1e39b',
        });
        const result = await packageInfo.getPackageInfo({
            name: 'squiss-ts',
            semver: '^3.0.0',
        });
        expect(result).toEqual({
            name: 'squiss-ts',
            semver: '^3.0.0',
            version: '3.0.1',
            engines: '>=6',
            commitSha: '5cd3e98b5236ce93bb522a893a7e09fd4de1e39b',
        });
        expect(manifestMock.mock.calls.length).toBe(1);
        expect(manifestMock.mock.calls[0].length).toBe(2);
        expect(manifestMock.mock.calls[0][0]).toBe('squiss-ts@^3.0.0');
    });

    it('should resolve package info properly when no engines data', async () => {
        manifestMock.mockResolvedValue({
            version: '3.0.1',
            repository: {
                url: 'git+https://github.com/PruvoNet/squiss-ts.git',
            },
            gitHead: '5cd3e98b5236ce93bb522a893a7e09fd4de1e39b',
        });
        const result = await packageInfo.getPackageInfo({
            name: 'squiss-ts',
            semver: '^3.0.0',
        });
        expect(result).toEqual({
            name: 'squiss-ts',
            semver: '^3.0.0',
            version: '3.0.1',
            repoUrl: 'git+https://github.com/PruvoNet/squiss-ts.git',
            commitSha: '5cd3e98b5236ce93bb522a893a7e09fd4de1e39b',
        });
        expect(manifestMock.mock.calls.length).toBe(1);
        expect(manifestMock.mock.calls[0].length).toBe(2);
        expect(manifestMock.mock.calls[0][0]).toBe('squiss-ts@^3.0.0');
    });

});
