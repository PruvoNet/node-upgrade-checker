import {ContainerModule} from 'inversify';
import * as nodeGit from 'nodegit';
import {NodeGit, TYPES} from './types';
import {Git} from './impl/git';
import {GitCheckout} from './impl/gitCheckout';
import {IGitCheckout} from './interfaces/gitCheckout';
import {IGit} from './interfaces/git';

export const gitContainerModule = new ContainerModule((bind) => {
    bind<NodeGit>(TYPES.NodeGit).toConstantValue(nodeGit);
    bind<IGit>(IGit).to(Git).inSingletonScope();
    bind<IGitCheckout>(IGitCheckout).to(GitCheckout).inSingletonScope();
});

export * from './interfaces/git';
export * from './interfaces/gitCheckout';
