/* eslint-disable jest/no-export */
/* eslint-disable @typescript-eslint/unbound-method */
import { mockClear, mock } from 'jest-mock-extended';
import { Connection } from 'typeorm/connection/Connection';
import { Repository } from 'typeorm/repository/Repository';
import { IEntity } from '../../../src/db/interfaces/IEntity';
import { IConnectionProvider } from '../../../src/db';
import { IRepositoryProvider } from '../../../src/db/interfaces/IRepositoryProvider';

export const testRepositoryProvider = <E extends IEntity, P extends IRepositoryProvider<E>>(
  entity: new () => E,
  repositoryProvider: new (connectionProvider: IConnectionProvider) => P
): void => {
  const repositoryMock = mock<Repository<E>>();
  const connectionMock = mock<Connection>();
  // @ts-ignore
  connectionMock.getRepository.mockReturnValue(repositoryMock);
  const connectionProviderMock = mock<IConnectionProvider>();
  connectionProviderMock.getConnection.mockResolvedValue(connectionMock);
  let dependencyRepositoryProvider: IRepositoryProvider<E>;

  beforeEach(() => {
    mockClear(connectionProviderMock);
    mockClear(connectionMock);
    mockClear(repositoryMock);
    dependencyRepositoryProvider = new repositoryProvider(connectionProviderMock);
  });

  it(`should cache repo`, async () => {
    const repo = await dependencyRepositoryProvider.getRepository();
    const repo2 = await dependencyRepositoryProvider.getRepository();
    expect(repo).toBe(repo2);
    expect(repo).toBe(repositoryMock);
    expect(connectionMock.getRepository).toBeCalledTimes(1);
    expect(connectionProviderMock.getConnection).toBeCalledTimes(1);
  });

  it(`should use connection properly`, async () => {
    const repo = await dependencyRepositoryProvider.getRepository();
    expect(repo).toBe(repositoryMock);
    expect(connectionProviderMock.getConnection).toBeCalledTimes(1);
    expect(connectionMock.getRepository).toBeCalledTimes(1);
    expect(connectionProviderMock.getConnection).toHaveBeenCalledWith();
    expect(connectionMock.getRepository).toHaveBeenCalledWith(entity);
  });
};
