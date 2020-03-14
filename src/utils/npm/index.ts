import {ContainerModule} from 'inversify';
import {Npm} from './npm';
import {INpm} from './interfaces';

export const npmContainerModule = new ContainerModule((bind) => {
    bind<INpm>(INpm).to(Npm).inSingletonScope();
});

export * from './interfaces';
