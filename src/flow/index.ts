import {ContainerModule} from 'inversify';
import {IFlow} from './interfaces/flow';
import {Flow} from './impl/flow';

export const flowContainerModule = new ContainerModule((bind) => {
    bind<IFlow>(IFlow).to(Flow).inSingletonScope();
});

export * from './interfaces/flow';
