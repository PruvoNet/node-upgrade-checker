import {ContainerModule} from 'inversify';
import * as nodeGit from 'nodegit';
import {NodeGit, TYPES} from './types';
import {Git} from './impl/git';
import {GitCheckout} from './impl/gitCheckout';
import {IGitCheckout} from './interfaces/gitCheckout';
import {IGit} from './interfaces/git';
import {IGetRepoDirName} from './interfaces/getRepoDirName';
import {GetRepoDirName} from './impl/getRepoDirName';

export const gitContainerModule = new ContainerModule((bind) => {
    bind<NodeGit>(TYPES.NodeGit).toConstantValue(nodeGit);
    bind<IGetRepoDirName>(IGetRepoDirName).to(GetRepoDirName).inSingletonScope();
    bind<IGit>(IGit).to(Git).inSingletonScope();
    bind<IGitCheckout>(IGitCheckout).to(GitCheckout).inSingletonScope();
});

export * from './interfaces/git';
export * from './interfaces/gitCheckout';
export * from './interfaces/getRepoDirName';
