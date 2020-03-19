import { interfaces } from 'inversify';
import { Git } from './impl/git';
import { GitCheckout } from './impl/gitCheckout';
import { IGitCheckout } from './interfaces/gitCheckout';
import { IGit } from './interfaces/git';
import Bind = interfaces.Bind;

export const gitModuleBinder = (bind: Bind): void => {
  bind<IGit>(IGit)
    .to(Git)
    .inSingletonScope();
  bind<IGitCheckout>(IGitCheckout)
    .to(GitCheckout)
    .inSingletonScope();
};

export * from './interfaces/git';
export * from './interfaces/gitCheckout';
