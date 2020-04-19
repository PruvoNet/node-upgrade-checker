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
import { namedOrMultiConstraint } from '../container/utils';
import { IConnectionOptionsProvider } from './interfaces/IConnectionOptionsProvider';
import { ConnectionOptionsProvider } from './impl/connectionOptionsProvider';

export const EntitiesTags = {
  dependencyVersion: DependencyVersion.TAG,
  dependency: Dependency.TAG,
};

export const dbModulesBinder = (bind: Bind): void => {
  bind<IDependencyRepositoryProvider>(IDependencyRepositoryProvider)
    .to(DependencyRepositoryProvider)
    .inSingletonScope();
  bind<IDependencyVersionRepositoryProvider>(IDependencyVersionRepositoryProvider)
    .to(DependencyVersionRepositoryProvider)
    .inSingletonScope();
  bind<IConnectionOptionsProvider>(IConnectionOptionsProvider).to(ConnectionOptionsProvider).inSingletonScope();
  bind<IConnectionProvider>(IConnectionProvider).to(ConnectionProvider).inSingletonScope();
  bind<IEntity>(IEntity).toConstantValue(Dependency).when(namedOrMultiConstraint(EntitiesTags.dependency, IEntity));
  bind<IEntity>(IEntity)
    .toConstantValue(DependencyVersion)
    .when(namedOrMultiConstraint(EntitiesTags.dependencyVersion, IEntity));
};

export * from './interfaces/IConnectionProvider';
export * from './interfaces/IDependencyRepositoryProvider';
export * from './interfaces/IDependencyVersionRepositoryProvider';
export * from './interfaces/IConnectionSettings';
export * from './interfaces/IConnectionOptionsProvider';
export * from './entities/dependency';
export * from './entities/dependencyVersion';
