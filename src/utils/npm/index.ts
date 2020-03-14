import {ContainerModule} from 'inversify';
import {Npm} from './impl/npm';
import {INpm} from './interfaces/npm';

export const npmContainerModule = new ContainerModule((bind) => {
    bind<INpm>(INpm).to(Npm).inSingletonScope();
});

export * from './interfaces/npm';
