import {ContainerModule} from 'inversify';
import * as child_process from 'child_process';
import {ChildProcess, TYPES} from './types';
import {IRunner, Runner} from './runner';

export const runnerContainerModule = new ContainerModule((bind) => {
    bind<ChildProcess>(TYPES.ChildProcess).toConstantValue(child_process);
    bind(IRunner).to(Runner).inSingletonScope();
});

export {IRunner} from './runner';
