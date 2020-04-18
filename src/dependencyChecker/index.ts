import { IDependencyChecker } from './interfaces/IDependencyChecker';
import { DependencyChecker } from './impl/dependencyChecker';
import { interfaces } from 'inversify';
import Bind = interfaces.Bind;
import { IPackageInfoCache } from './interfaces/IPackageInfoCache';
import { PackageInfoCache } from './impl/packageInfoCache';

export const dependencyCheckerModulesBinder = (bind: Bind): void => {
  bind<IDependencyChecker>(IDependencyChecker).to(DependencyChecker).inSingletonScope();
  bind<IPackageInfoCache>(IPackageInfoCache).to(PackageInfoCache).inSingletonScope();
};

export * from './interfaces/IDependencyChecker';
export * from './interfaces/IPackageInfoCache';
