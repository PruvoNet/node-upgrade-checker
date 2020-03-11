import {executeCommand} from '../runner/index';

export interface INpmInstallOptions {
    npmCommand: string;
    cwd: string;
}

export const npmInstall = async ({npmCommand, cwd}: INpmInstallOptions): Promise<void> => {
    await executeCommand({
        command: [npmCommand, 'install'],
        execOptions: {
            cwd,
        },
    });
};
