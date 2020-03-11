import {Container} from 'inversify';
import {gitContainerModule} from './utils/git/index';

export const container = new Container();

container.load(gitContainerModule);
