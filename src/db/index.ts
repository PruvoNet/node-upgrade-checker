import {ContainerModule} from 'inversify';
import {DependencyRepositoryProvider} from './impl/dependencyRepositoryProvider';
import {IDependencyRepositoryProvider} from './interfaces/dependencyRepositoryProvider';
import {ConnectionProvider} from './impl/connectionProvider';
import {DependencyVersionRepositoryProvider} from './impl/dependencyVersionRepositoryProvider';
import {IDependencyVersionRepositoryProvider} from './interfaces/dependencyVersionRepositoryProvider';
import {IConnectionProvider} from './interfaces/connectionProvider';

export const dbContainerModule = new ContainerModule((bind) => {
    bind<IDependencyRepositoryProvider>(IDependencyRepositoryProvider)
        .to(DependencyRepositoryProvider).inSingletonScope();
    bind<IDependencyVersionRepositoryProvider>(IDependencyVersionRepositoryProvider)
        .to(DependencyVersionRepositoryProvider).inSingletonScope();
    bind<IConnectionProvider>(IConnectionProvider).to(ConnectionProvider).inSingletonScope();
});

export * from './interfaces/connectionProvider';
export * from './interfaces/dependencyRepositoryProvider';
export * from './interfaces/dependencyVersionRepositoryProvider';
export * from './interfaces/connectionSettings';
export * from './impl/connectionSettings';
export * from './entities/dependency';
export * from './entities/dependencyVersion';
