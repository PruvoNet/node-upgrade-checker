import { interfaces } from 'inversify';
import Bind = interfaces.Bind;
import { IEnginesResolver } from './interfaces/enginesResolver';
import { EnginesResolver } from './impl/enginesResolver';

export const enginesResolveModulesBinder = (bind: Bind): void => {
  bind<IEnginesResolver>(IEnginesResolver)
    .to(EnginesResolver)
    .inSingletonScope();
};

export * from './interfaces/enginesResolver';
