import { interfaces } from 'inversify';
import { Git } from './impl/git';
import { GitCheckout } from './impl/gitCheckout';
import { IGitCheckout } from './interfaces/IGitCheckout';
import Bind = interfaces.Bind;

export const gitModuleBinder = (bind: Bind): void => {
  bind<Git>(Git).to(Git).inSingletonScope();
  bind<IGitCheckout>(IGitCheckout).to(GitCheckout).inSingletonScope();
};

export * from './interfaces/IGitCheckout';
