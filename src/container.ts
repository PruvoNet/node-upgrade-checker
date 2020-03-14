import {Container} from 'inversify';
import {gitContainerModule} from './utils/git';
import {runnerContainerModule} from './utils/runner';
import {npmContainerModule} from './utils/npm';

export const container = new Container();

container.load(gitContainerModule);
container.load(runnerContainerModule);
container.load(npmContainerModule);
