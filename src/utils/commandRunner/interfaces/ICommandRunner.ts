import { SpawnOptionsWithoutStdio } from 'child_process';
import { injectable } from 'inversify';

export interface IExecuteCommandOptions {
  command: string[];
  execOptions: SpawnOptionsWithoutStdio;
}

@injectable()
export abstract class ICommandRunner {
  public abstract async executeCommand(options: IExecuteCommandOptions): Promise<void>;
}
