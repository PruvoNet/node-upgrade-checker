import {ContainerModule} from 'inversify';
import {ICacheResolver} from './interfaces/cacheResolver';
import {CacheResolver} from './impl/cacheResolver';

export const cacheResolverContainerModule = new ContainerModule((bind) => {
    bind<ICacheResolver>(ICacheResolver).to(CacheResolver).inSingletonScope();
});

export * from './interfaces/cacheResolver';
