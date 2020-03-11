import {ContainerModule} from 'inversify';
import * as nodeGit from 'nodegit';
import {NodeGit, TYPES} from './types';
import {IGit, Git} from './git';
import {GitCheckout, IGitCheckout} from './gitCheckout';

export const gitContainerModule = new ContainerModule((bind) => {
    bind<NodeGit>(TYPES.NodeGit).toConstantValue(nodeGit);
    bind(IGit).to(Git).inSingletonScope();
    bind(IGitCheckout).to(GitCheckout).inSingletonScope();
});

export {IGitCheckout} from './gitCheckout';
