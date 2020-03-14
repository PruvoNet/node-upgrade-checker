import {ContainerModule} from 'inversify';
import {TestResolver} from './impl/testResolver';
import {ITestResolver} from './interfaces/testResolver';

export const testResolverContainerModule = new ContainerModule((bind) => {
    bind<ITestResolver>(ITestResolver).to(TestResolver).inSingletonScope();
});

export * from './interfaces/testResolver';
