import { DependencyRepositoryProvider } from './impl/dependencyRepositoryProvider';
import { IDependencyRepositoryProvider } from './interfaces/IDependencyRepositoryProvider';
import { ConnectionProvider } from './impl/connectionProvider';
import { DependencyVersionRepositoryProvider } from './impl/dependencyVersionRepositoryProvider';
import { IDependencyVersionRepositoryProvider } from './interfaces/IDependencyVersionRepositoryProvider';
import { IConnectionProvider } from './interfaces/IConnectionProvider';
import { interfaces } from 'inversify';
import Bind = interfaces.Bind;
import { IEntity } from './interfaces/IEntity';
import { Dependency } from './entities/dependency';
import { DependencyVersion } from './entities/dependencyVersion';

export const dbModulesBinder = (bind: Bind): void => {
  bind<IDependencyRepositoryProvider>(IDependencyRepositoryProvider)
    .to(DependencyRepositoryProvider)
    .inSingletonScope();
  bind<IDependencyVersionRepositoryProvider>(IDependencyVersionRepositoryProvider)
    .to(DependencyVersionRepositoryProvider)
    .inSingletonScope();
  bind<IConnectionProvider>(IConnectionProvider).to(ConnectionProvider).inSingletonScope();
  bind<IEntity>(IEntity).toConstantValue(Dependency);
  bind<IEntity>(IEntity).toConstantValue(DependencyVersion);
};

export * from './interfaces/IConnectionProvider';
export * from './interfaces/IDependencyRepositoryProvider';
export * from './interfaces/IDependencyVersionRepositoryProvider';
export * from './interfaces/IConnectionSettings';
export * from './entities/dependency';
export * from './entities/dependencyVersion';
