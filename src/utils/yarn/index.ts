import { interfaces } from 'inversify';
import { Yarn } from './impl/yarn';
import { IYarn } from './interfaces/IYarn';
import Bind = interfaces.Bind;

export const yarnModulesBinder = (bind: Bind): void => {
  bind<IYarn>(IYarn).to(Yarn).inSingletonScope();
};

export * from './interfaces/IYarn';
