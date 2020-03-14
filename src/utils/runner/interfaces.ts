import {SpawnOptionsWithoutStdio} from 'child_process';
import {injectable} from 'inversify';

export interface IExecuteCommandOptions {
    command: string[];
    execOptions?: SpawnOptionsWithoutStdio;
    retryCount?: number;
}

@injectable()
export abstract class IRunner {
    abstract async executeCommand(options: IExecuteCommandOptions): Promise<void>;
}
