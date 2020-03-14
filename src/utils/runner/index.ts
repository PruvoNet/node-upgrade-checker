import {ContainerModule} from 'inversify';
import * as child_process from 'child_process';
import {ChildProcess, TYPES} from './types';
import {Runner} from './runner';
import {IRunner} from './interfaces';

export const runnerContainerModule = new ContainerModule((bind) => {
    bind<ChildProcess>(TYPES.ChildProcess).toConstantValue(child_process);
    bind<IRunner>(IRunner).to(Runner).inSingletonScope();
});

export * from './interfaces';
