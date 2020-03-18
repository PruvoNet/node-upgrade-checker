import {ContainerModule} from 'inversify';
import {Runner} from './impl/runner';
import {IRunner} from './interfaces/runner';

export const runnerContainerModule = new ContainerModule((bind) => {
    bind<IRunner>(IRunner).to(Runner).inSingletonScope();
});

export * from './interfaces/runner';
