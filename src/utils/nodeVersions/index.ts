import { INodeVersions } from './interfaces/INodeVersions';
import { NodeVersions } from './impl/nodeVersions';
import { interfaces } from 'inversify';
import Bind = interfaces.Bind;

export const nodeVersionsModulesBinder = (bind: Bind): void => {
  bind<INodeVersions>(INodeVersions).to(NodeVersions).inSingletonScope();
};

export * from './interfaces/INodeVersions';
