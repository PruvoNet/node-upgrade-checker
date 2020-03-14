import {SpawnOptionsWithoutStdio} from 'child_process';
import {inject, injectable} from 'inversify';
import {ChildProcess, TYPES} from './types';
import {IExecuteCommandOptions, IRunner} from './interfaces';

interface IPromisifiedSpawnOptions {
    command: string;
    options: string[];
    execOptions: SpawnOptionsWithoutStdio;
}

@injectable()
export class Runner extends IRunner {

    constructor(@inject(TYPES.ChildProcess) private childProcess: ChildProcess) {
        super();
    }

    public async executeCommand({command, execOptions = {}, retryCount = 1}
                                    : IExecuteCommandOptions): Promise<void> {
        try {
            const firstCommand = command[0];
            const options = command.slice(1);
            await this.promisifiedSpawn({command: firstCommand, options, execOptions});
        } catch (error) {
            if (retryCount > 0) {
                await this.executeCommand({command, execOptions, retryCount: retryCount - 1});
            } else {
                throw error;
            }
        }
    }

    private async promisifiedSpawn({command, options, execOptions}: IPromisifiedSpawnOptions)
        : Promise<void> {
        return await new Promise((resolve, reject) => {
            const subProcess = this.childProcess.spawn(command, options, execOptions);
            subProcess.stdout.on('data', (data) => {
                process.stdout.write(data.toString());
            });
            subProcess.stderr.on('data', (data) => {
                process.stderr.write(data.toString());
            });
            subProcess.on('error', (err) => {
                console.error('spawn error: ', err);
            });
            subProcess.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(`"${command} ${options.join(' ')}" exited with code: ${code}`);
                }
            });
        });
    }
}

