import { DependencyRepositoryProvider } from './impl/dependencyRepositoryProvider';
import { IDependencyRepositoryProvider } from './interfaces/dependencyRepositoryProvider';
import { ConnectionProvider } from './impl/connectionProvider';
import { DependencyVersionRepositoryProvider } from './impl/dependencyVersionRepositoryProvider';
import { IDependencyVersionRepositoryProvider } from './interfaces/dependencyVersionRepositoryProvider';
import { IConnectionProvider } from './interfaces/connectionProvider';
import { interfaces } from 'inversify';
import Bind = interfaces.Bind;
import { IEntity } from './interfaces/entity';
import { Dependency } from './entities/dependency';
import { DependencyVersion } from './entities/dependencyVersion';

export const dbModulesBinder = (bind: Bind): void => {
  bind<IDependencyRepositoryProvider>(IDependencyRepositoryProvider)
    .to(DependencyRepositoryProvider)
    .inSingletonScope();
  bind<IDependencyVersionRepositoryProvider>(IDependencyVersionRepositoryProvider)
    .to(DependencyVersionRepositoryProvider)
    .inSingletonScope();
  bind<IConnectionProvider>(IConnectionProvider)
    .to(ConnectionProvider)
    .inSingletonScope();
  bind<IEntity>(IEntity).toConstantValue(Dependency);
  bind<IEntity>(IEntity).toConstantValue(DependencyVersion);
};

export * from './interfaces/connectionProvider';
export * from './interfaces/dependencyRepositoryProvider';
export * from './interfaces/dependencyVersionRepositoryProvider';
export * from './interfaces/connectionSettings';
export * from './entities/dependency';
export * from './entities/dependencyVersion';
