import { interfaces } from 'inversify';
import { Runner } from './impl/runner';
import { IRunner } from './interfaces/runner';
import Bind = interfaces.Bind;

export const runnerModuleBinder = (bind: Bind): void => {
  bind<IRunner>(IRunner)
    .to(Runner)
    .inSingletonScope();
};

export * from './interfaces/runner';
