import {executeCommand} from '../runner/index';

export interface INpmBuildOptions {
    npmCommand: string;
    cwd: string;
}

export const npmBuild = async ({npmCommand, cwd}: INpmBuildOptions): Promise<void> => {
    await executeCommand({
        command: [npmCommand, 'run', 'build'],
        execOptions: {
            cwd,
        },
    });
};
