import { DependencyVersion, IConnectionProvider } from '../../../../src/db';
import { Connection } from 'typeorm/connection/Connection';
import { DependencyVersionRepositoryProvider } from '../../../../src/db/impl/dependencyVersionRepositoryProvider';

describe(`dependency version repository provider`, () => {
  const placeholder = `PLACEHOLDER`;
  const getRepositoryMock = jest.fn();
  const connectionSpy = ({
    getRepository: getRepositoryMock,
  } as any) as Connection;
  const getConnectionMock = jest.fn();
  const connectionProviderSpy = ({
    getConnection: getConnectionMock,
  } as any) as IConnectionProvider;
  let dependencyVersionRepositoryProvider: DependencyVersionRepositoryProvider;

  beforeEach(() => {
    dependencyVersionRepositoryProvider = new DependencyVersionRepositoryProvider(connectionProviderSpy);
    getConnectionMock.mockReset();
    getConnectionMock.mockResolvedValue(connectionSpy);
    getRepositoryMock.mockReset();
    getRepositoryMock.mockReturnValue(placeholder);
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
