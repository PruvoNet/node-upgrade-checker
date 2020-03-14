import {SpawnOptionsWithoutStdio} from 'child_process';
import {inject, injectable} from 'inversify';
import {ChildProcess, TYPES} from '../types';
import {IExecuteCommandOptions, IRunner} from '../interfaces/runner';

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

    public async executeCommand({command, execOptions}
                                    : IExecuteCommandOptions): Promise<void> {
        const firstCommand = command[0];
        const options = command.slice(1);
        await this.promisifiedSpawn({command: firstCommand, options, execOptions});
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
                    reject(new Error(`"${command} ${options.join(' ')}" exited with code: ${code}`));
                }
            });
        });
    }
}
