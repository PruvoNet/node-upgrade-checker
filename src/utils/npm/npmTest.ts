import {executeCommand} from '../runner/index';

export interface INpmTestOptions {
    npmCommand: string;
    cwd: string;
}

export const npmTest = async ({npmCommand, cwd}: INpmTestOptions): Promise<void> => {
    await executeCommand({
        command: [npmCommand, 'run', 'test'],
        execOptions: {
            cwd,
        },
    });
};
