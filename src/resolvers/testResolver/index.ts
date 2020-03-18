import {TestResolver} from './impl/testResolver';
import {ITestResolver} from './interfaces/testResolver';
import {interfaces} from 'inversify';
import Bind = interfaces.Bind;

export const testResolverModulesBinder = (bind: Bind) => {
    bind<ITestResolver>(ITestResolver).to(TestResolver).inSingletonScope();
};

export * from './interfaces/testResolver';
