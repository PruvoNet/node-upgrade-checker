import {ContainerModule} from 'inversify';
import * as nodeGit from 'nodegit';
import {NodeGit, TYPES} from './types';
import {Git} from './git';
import {GitCheckout} from './gitCheckout';
import {IGit, IGitCheckout} from './interfaces';

export const gitContainerModule = new ContainerModule((bind) => {
    bind<NodeGit>(TYPES.NodeGit).toConstantValue(nodeGit);
    bind<IGit>(IGit).to(Git).inSingletonScope();
    bind<IGitCheckout>(IGitCheckout).to(GitCheckout).inSingletonScope();
});

export * from './interfaces';
