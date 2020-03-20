import { Container, ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import { gitModuleBinder } from '../utils/git';
import { runnerModuleBinder } from '../utils/runner';
import { npmModulesBinder } from '../utils/npm';
import { ciResolverModulesBinder } from '../resolvers/ciResolver';
import { dbModulesBinder } from '../db';
import { cacheResolveModulesBinder } from '../resolvers/cacheResolver';
import { testResolverModulesBinder } from '../resolvers/testResolver';
import { flowModulesBinder } from '../flow';
import { ltsModulesBinder } from '../utils/lts';
import { packageInfoModulesBinder } from '../utils/packageInfo';
import { nodeModulesBinder } from './nodeModulesContainer';
import { enginesResolveModulesBinder } from '../resolvers/enginesResolver';

export const container = new Container();

type Binder = (bind: Bind) => void;

const binders: Binder[] = [
  gitModuleBinder,
  nodeModulesBinder,
  runnerModuleBinder,
  npmModulesBinder,
  ciResolverModulesBinder,
  dbModulesBinder,
  cacheResolveModulesBinder,
  testResolverModulesBinder,
  flowModulesBinder,
  ltsModulesBinder,
  packageInfoModulesBinder,
  enginesResolveModulesBinder,
];

container.load(
  new ContainerModule((bind) => {
    binders.forEach((binder) => {
      binder(bind);
    });
  })
);
