import {
  dbModulesBinder,
  Dependency,
  DependencyVersion,
  IConnectionProvider,
  IDependencyRepositoryProvider,
  IDependencyVersionRepositoryProvider,
} from '../../../src/db';
import { DependencyRepositoryProvider } from '../../../src/db/impl/dependencyRepositoryProvider';
import { DependencyVersionRepositoryProvider } from '../../../src/db/impl/dependencyVersionRepositoryProvider';
import { ConnectionProvider } from '../../../src/db/impl/connectionProvider';
import { IEntity } from '../../../src/db/interfaces/entity';

describe(`db module container`, () => {
  it(`should perform bindings properly`, async () => {
    const inSingletonScopeMock = jest.fn();
    const toSpy = {
      inSingletonScope: inSingletonScopeMock,
    };
    const toMock = jest.fn();
    toMock.mockReturnValue(toSpy);
    const toConstantValueMock = jest.fn();
    const bindSpy = {
      to: toMock,
      toConstantValue: toConstantValueMock,
    };
    const bindMock = jest.fn();
    bindMock.mockReturnValue(bindSpy);
    dbModulesBinder(bindMock);
    expect(bindMock).toHaveBeenCalledTimes(5);
    expect(bindMock).toHaveBeenNthCalledWith(1, IDependencyRepositoryProvider);
    expect(bindMock).toHaveBeenNthCalledWith(2, IDependencyVersionRepositoryProvider);
    expect(bindMock).toHaveBeenNthCalledWith(3, IConnectionProvider);
    expect(bindMock).toHaveBeenNthCalledWith(4, IEntity);
    expect(bindMock).toHaveBeenNthCalledWith(5, IEntity);

    expect(toMock).toHaveBeenCalledTimes(3);
    expect(toMock).toHaveBeenNthCalledWith(1, DependencyRepositoryProvider);
    expect(toMock).toHaveBeenNthCalledWith(2, DependencyVersionRepositoryProvider);
    expect(toMock).toHaveBeenNthCalledWith(3, ConnectionProvider);

    expect(toConstantValueMock).toHaveBeenCalledTimes(2);
    expect(toConstantValueMock).toHaveBeenNthCalledWith(1, Dependency);
    expect(toConstantValueMock).toHaveBeenNthCalledWith(2, DependencyVersion);

    expect(inSingletonScopeMock).toHaveBeenCalledTimes(3);
    expect(inSingletonScopeMock).toHaveBeenNthCalledWith(1);
    expect(inSingletonScopeMock).toHaveBeenNthCalledWith(2);
    expect(inSingletonScopeMock).toHaveBeenNthCalledWith(3);
  });
});
