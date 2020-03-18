import {DependencyVersion, IConnectionProvider} from '../../../../src/db';
import {Connection} from 'typeorm/connection/Connection';
import Mock = jest.Mock;
import {DependencyVersionRepositoryProvider} from '../../../../src/db/impl/dependencyVersionRepositoryProvider';

describe(`dependency version repository provider`, () => {

    const placeholder = `PLACEHOLDER`;

    let dependencyVersionRepositoryProvider: DependencyVersionRepositoryProvider;
    let getConnectionMock: Mock;
    let getRepositoryMock: Mock;

    beforeEach(() => {
        getRepositoryMock = jest.fn();
        getRepositoryMock.mockReturnValue(placeholder);
        const connectionSpy = {
            getRepository: getRepositoryMock,
        } as any as Connection;
        getConnectionMock = jest.fn();
        getConnectionMock.mockResolvedValue(connectionSpy);
        const connectionProviderSpy = {
            getConnection: getConnectionMock,
        } as any as IConnectionProvider;
        dependencyVersionRepositoryProvider = new DependencyVersionRepositoryProvider(connectionProviderSpy);
    });

    it(`should cache repo`, async () => {
        const repo = await dependencyVersionRepositoryProvider.getRepository();
        const repo2 = await dependencyVersionRepositoryProvider.getRepository();
        expect(repo).toEqual(repo2);
        expect(repo).toBe(placeholder);
        expect(getConnectionMock).toBeCalledTimes(1);
        expect(getRepositoryMock).toBeCalledTimes(1);
    });

    it(`should use connection properly`, async () => {
        const repo = await dependencyVersionRepositoryProvider.getRepository();
        expect(repo).toBe(placeholder);
        expect(getConnectionMock).toBeCalledTimes(1);
        expect(getRepositoryMock).toBeCalledTimes(1);
        expect(getConnectionMock).toHaveBeenCalledWith();
        expect(getRepositoryMock).toHaveBeenCalledWith(DependencyVersion);
    });

});
