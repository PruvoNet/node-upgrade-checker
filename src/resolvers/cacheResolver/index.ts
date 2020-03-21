import { ICacheResolver } from './interfaces/cacheResolver';
import { CacheResolver } from './impl/cacheResolver';
import { interfaces } from 'inversify';
import Bind = interfaces.Bind;

export const cacheResolveModulesBinder = (bind: Bind): void => {
  bind<ICacheResolver>(ICacheResolver).to(CacheResolver).inSingletonScope();
};

export * from './interfaces/cacheResolver';
