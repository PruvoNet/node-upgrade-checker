import { Container, ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import { gitModuleBinder } from '../utils/git';
import { commandRunnerModuleBinder } from '../utils/commandRunner';
import { yarnModulesBinder } from '../utils/yarn';
import { ciResolverModulesBinder } from '../resolvers/ciResolver';
import { dbModulesBinder } from '../db';
import { cacheResolveModulesBinder } from '../resolvers/cacheResolver';
import { testResolverModulesBinder } from '../resolvers/testResolver';
import { dependencyCheckerModulesBinder } from '../dependencyChecker';
import { nodeVersionsModulesBinder } from '../utils/nodeVersions';
import { packageInfoModulesBinder } from '../utils/packageInfo';
import { nodeModulesBinder } from './nodeModulesContainer';
import { enginesResolveModulesBinder } from '../resolvers/enginesResolver';
import { loggerModuleBinder } from '../utils/logger';

export const container = new Container({
  skipBaseClassChecks: true,
});

type Binder = (bind: Bind) => void;

const binders: Binder[] = [
  gitModuleBinder,
  nodeModulesBinder,
  commandRunnerModuleBinder,
  yarnModulesBinder,
  ciResolverModulesBinder,
  dbModulesBinder,
  cacheResolveModulesBinder,
  testResolverModulesBinder,
  dependencyCheckerModulesBinder,
  nodeVersionsModulesBinder,
  packageInfoModulesBinder,
  enginesResolveModulesBinder,
  loggerModuleBinder,
];

container.load(
  new ContainerModule((bind) => {
    binders.forEach((binder) => {
      binder(bind);
    });
  })
);
