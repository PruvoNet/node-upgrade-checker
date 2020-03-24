import { IDependencyChecker } from './interfaces/IDependencyChecker';
import { DependencyChecker } from './impl/dependencyChecker';
import { interfaces } from 'inversify';
import Bind = interfaces.Bind;

export const dependencyCheckerModulesBinder = (bind: Bind): void => {
  bind<IDependencyChecker>(IDependencyChecker).to(DependencyChecker).inSingletonScope();
};

export * from './interfaces/IDependencyChecker';
