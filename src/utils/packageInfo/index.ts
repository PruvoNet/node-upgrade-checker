import { IPackageInfo } from './interfaces/IPackageInfo';
import { PackageInfo } from './impl/packageInfo';
import { interfaces } from 'inversify';
import Bind = interfaces.Bind;
import { NpmConfigRetriever } from './impl/npmConfigRetriever';
import { INpmConfigRetriever } from './interfaces/INpmConfigRetriever';

export const packageInfoModulesBinder = (bind: Bind): void => {
  bind<INpmConfigRetriever>(INpmConfigRetriever).to(NpmConfigRetriever).inSingletonScope();
  bind<IPackageInfo>(IPackageInfo).to(PackageInfo).inSingletonScope();
};

export * from './interfaces/IPackageInfo';
export * from './interfaces/INpmConfigRetriever';
