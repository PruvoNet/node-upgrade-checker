import {
  dbModulesBinder,
  IConnectionProvider,
  IDependencyRepositoryProvider,
  IDependencyVersionRepositoryProvider,
} from '../../../src/db';
import { DependencyRepositoryProvider } from '../../../src/db/impl/dependencyRepositoryProvider';
import { DependencyVersionRepositoryProvider } from '../../../src/db/impl/dependencyVersionRepositoryProvider';
import { ConnectionProvider } from '../../../src/db/impl/connectionProvider';

describe(`db module container`, () => {
  it(`should perform bindings properly`, async () => {
    const inSingletonScopeMock = jest.fn();
    const toSpy = {
      inSingletonScope: inSingletonScopeMock,
    };
    const toMock = jest.fn();
    toMock.mockReturnValue(toSpy);
    const bindSpy = {
      to: toMock,
    };
    const bindMock = jest.fn();
    bindMock.mockReturnValue(bindSpy);
    dbModulesBinder(bindMock);
    expect(bindMock).toHaveBeenCalledTimes(3);
    expect(bindMock).toHaveBeenNthCalledWith(1, IDependencyRepositoryProvider);
    expect(bindMock).toHaveBeenNthCalledWith(2, IDependencyVersionRepositoryProvider);
    expect(bindMock).toHaveBeenNthCalledWith(3, IConnectionProvider);

    expect(toMock).toHaveBeenCalledTimes(3);
    expect(toMock).toHaveBeenNthCalledWith(1, DependencyRepositoryProvider);
    expect(toMock).toHaveBeenNthCalledWith(2, DependencyVersionRepositoryProvider);
    expect(toMock).toHaveBeenNthCalledWith(3, ConnectionProvider);

    expect(inSingletonScopeMock).toHaveBeenCalledTimes(3);
    expect(inSingletonScopeMock).toHaveBeenNthCalledWith(1);
    expect(inSingletonScopeMock).toHaveBeenNthCalledWith(2);
    expect(inSingletonScopeMock).toHaveBeenNthCalledWith(3);
  });
});
