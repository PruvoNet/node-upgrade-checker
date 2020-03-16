import {Container} from 'inversify';
import {gitContainerModule} from './utils/git';
import {runnerContainerModule} from './utils/runner';
import {npmContainerModule} from './utils/npm';
import {ciResolverContainerModule} from './resolvers/ciResolver';
import {dbContainerModule} from './db';
import {cacheResolverContainerModule} from './resolvers/cacheResolver';
import {testResolverContainerModule} from './resolvers/testResolver';
import {flowContainerModule} from './flow';
import {ltsContainerModule} from './utils/lts';

export const container = new Container();

container.load(gitContainerModule);
container.load(runnerContainerModule);
container.load(npmContainerModule);
container.load(ciResolverContainerModule);
container.load(dbContainerModule);
container.load(cacheResolverContainerModule);
container.load(testResolverContainerModule);
container.load(flowContainerModule);
container.load(ltsContainerModule);
