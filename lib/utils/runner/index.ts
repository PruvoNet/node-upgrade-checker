import {spawn, SpawnOptionsWithoutStdio} from 'child_process';

export interface IExecuteCommandOptions {
    command: string[];
    execOptions?: SpawnOptionsWithoutStdio;
    retryCount?: number;
}

export const executeCommand = async ({command, execOptions = {}, retryCount = 1}
                                         : IExecuteCommandOptions): Promise<void> => {
    try {
        const firstCommand = command[0];
        const options = command.slice(1);
        await promisifiedSpawn({command: firstCommand, options, execOptions});
    } catch (error) {
        if (retryCount > 0) {
            await executeCommand({command, execOptions, retryCount: retryCount - 1});
        } else {
            throw error;
        }
    }
};

export interface IPromisifiedSpawnOptions {
    command: string;
    options: string[];
    execOptions: SpawnOptionsWithoutStdio;
}


const promisifiedSpawn = async ({command, options, execOptions}: IPromisifiedSpawnOptions)
    : Promise<void> => {
    return new Promise((resolve, reject) => {
        const subProcess = spawn(command, options, execOptions);
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
};
