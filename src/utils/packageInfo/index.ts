import {ContainerModule} from 'inversify';
import {IPackageInfo} from './interfaces/packageInfo';
import {PackageInfo} from './impl/packageInfo';

export const packageInfoContainerModule = new ContainerModule((bind) => {
    bind<IPackageInfo>(IPackageInfo).to(PackageInfo).inSingletonScope();
});

export * from './interfaces/packageInfo';
