import {ContainerModule} from 'inversify';
import {IPackageInfo} from './interfaces/packageInfo';
import {PackageInfo} from './impl/packageInfo';
import * as pacote from 'pacote';
import {Pacote, TYPES} from './types';

export const packageInfoContainerModule = new ContainerModule((bind) => {
    bind<Pacote>(TYPES.Pacote).toConstantValue(pacote);
    bind<IPackageInfo>(IPackageInfo).to(PackageInfo).inSingletonScope();
});

export * from './interfaces/packageInfo';
