import { IFlow } from './interfaces/IFlow';
import { Flow } from './impl/flow';
import { interfaces } from 'inversify';
import Bind = interfaces.Bind;

export const flowModulesBinder = (bind: Bind): void => {
  bind<IFlow>(IFlow).to(Flow).inSingletonScope();
};

export * from './interfaces/IFlow';
