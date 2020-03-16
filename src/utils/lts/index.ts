import {ContainerModule} from 'inversify';
import {ILts} from './interfaces/lts';
import {Lts} from './impl/lts';

export const ltsContainerModule = new ContainerModule((bind) => {
    bind<ILts>(ILts).to(Lts).inSingletonScope();
});

export * from './interfaces/lts';
