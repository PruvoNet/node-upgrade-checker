import {ContainerModule} from 'inversify';
import {Npm, INpm} from './npm';

export const npmContainerModule = new ContainerModule((bind) => {
    bind(INpm).to(Npm).inSingletonScope();
});

export {INpm} from './npm';
