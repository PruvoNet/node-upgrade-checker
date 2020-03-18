import {Dependency, IConnectionProvider} from '../../../../src/db';
import {DependencyRepositoryProvider} from '../../../../src/db/impl/dependencyRepositoryProvider';
import {Connection} from 'typeorm/connection/Connection';
import Mock = jest.Mock;

describe(`dependency repository provider`, () => {

    const placeholder = `PLACEHOLDER`;

    let dependencyRepositoryProvider: DependencyRepositoryProvider;
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
        dependencyRepositoryProvider = new DependencyRepositoryProvider(connectionProviderSpy);
    });

    it(`should cache repo`, async () => {
        const repo = await dependencyRepositoryProvider.getRepository();
        const repo2 = await dependencyRepositoryProvider.getRepository();
        expect(repo).toEqual(repo2);
        expect(repo).toBe(placeholder);
        expect(getConnectionMock).toBeCalledTimes(1);
        expect(getRepositoryMock).toBeCalledTimes(1);
    });

    it(`should use connection properly`, async () => {
        const repo = await dependencyRepositoryProvider.getRepository();
        expect(repo).toBe(placeholder);
        expect(getConnectionMock).toBeCalledTimes(1);
        expect(getRepositoryMock).toBeCalledTimes(1);
        expect(getConnectionMock).toHaveBeenCalledWith();
        expect(getRepositoryMock).toHaveBeenCalledWith(Dependency);
    });

});
