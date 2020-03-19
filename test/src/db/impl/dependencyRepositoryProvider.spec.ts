import { Dependency, IConnectionProvider } from '../../../../src/db';
import { DependencyRepositoryProvider } from '../../../../src/db/impl/dependencyRepositoryProvider';
import { Connection } from 'typeorm/connection/Connection';

describe(`dependency repository provider`, () => {
  const placeholder = `PLACEHOLDER`;

  const getRepositoryMock = jest.fn();
  const connectionSpy = ({
    getRepository: getRepositoryMock,
  } as any) as Connection;
  const getConnectionMock = jest.fn();
  const connectionProviderSpy = ({
    getConnection: getConnectionMock,
  } as any) as IConnectionProvider;
  let dependencyRepositoryProvider: DependencyRepositoryProvider;

  beforeEach(() => {
    dependencyRepositoryProvider = new DependencyRepositoryProvider(connectionProviderSpy);
    getConnectionMock.mockReset();
    getConnectionMock.mockResolvedValue(connectionSpy);
    getRepositoryMock.mockReset();
    getRepositoryMock.mockReturnValue(placeholder);
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
