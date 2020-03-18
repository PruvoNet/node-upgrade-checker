import {IPackageInfo} from './interfaces/packageInfo';
import {PackageInfo} from './impl/packageInfo';
import {interfaces} from 'inversify';
import Bind = interfaces.Bind;

export const packageInfoModulesBinder = (bind: Bind): void => {
    bind<IPackageInfo>(IPackageInfo).to(PackageInfo).inSingletonScope();
};

export * from './interfaces/packageInfo';
