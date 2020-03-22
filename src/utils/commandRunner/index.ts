import { interfaces } from 'inversify';
import { CommandRunner } from './impl/commandRunner';
import { ICommandRunner } from './interfaces/ICommandRunner';
import Bind = interfaces.Bind;

export const commandRunnerModuleBinder = (bind: Bind): void => {
  bind<ICommandRunner>(ICommandRunner).to(CommandRunner).inSingletonScope();
};

export * from './interfaces/ICommandRunner';
