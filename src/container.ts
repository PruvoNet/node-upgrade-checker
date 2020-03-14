import {Container} from 'inversify';
import {gitContainerModule} from './utils/git';
import {runnerContainerModule} from './utils/runner';
import {npmContainerModule} from './utils/npm';
import {ciResolverContainerModule} from './utils/resolvers/ciResolver';
import {dbContainerModule} from './db';
import {cacheResolverContainerModule} from './utils/resolvers/cacheResolver';

export const container = new Container();

container.load(gitContainerModule);
container.load(runnerContainerModule);
container.load(npmContainerModule);
container.load(ciResolverContainerModule);
container.load(dbContainerModule);
container.load(cacheResolverContainerModule);
