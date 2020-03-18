import {interfaces} from 'inversify';
import {Npm} from './impl/npm';
import {INpm} from './interfaces/npm';
import Bind = interfaces.Bind;

export const npmModulesBinder = (bind: Bind) => {
    bind<INpm>(INpm).to(Npm).inSingletonScope();
};

export * from './interfaces/npm';
