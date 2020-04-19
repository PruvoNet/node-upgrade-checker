import { SpawnOptionsWithoutStdio } from 'child_process';

export interface IExecuteCommandOptions {
  command: string[];
  execOptions: SpawnOptionsWithoutStdio;
}

export abstract class ICommandRunner {
  public abstract async executeCommand(options: IExecuteCommandOptions): Promise<void>;
}
