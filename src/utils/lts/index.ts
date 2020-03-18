import {ILts} from './interfaces/lts';
import {Lts} from './impl/lts';
import {interfaces} from 'inversify';
import Bind = interfaces.Bind;

export const ltsModulesBinder = (bind: Bind) => {
    bind<ILts>(ILts).to(Lts).inSingletonScope();
};

export * from './interfaces/lts';
