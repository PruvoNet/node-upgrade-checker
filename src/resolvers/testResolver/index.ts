import { TestResolver } from './impl/testResolver';
import { ITestResolver } from './interfaces/ITestResolver';
import { interfaces } from 'inversify';
import Bind = interfaces.Bind;

export const testResolverModulesBinder = (bind: Bind): void => {
  bind<ITestResolver>(ITestResolver).to(TestResolver).inSingletonScope();
};

export * from './interfaces/ITestResolver';
