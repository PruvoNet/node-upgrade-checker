import {IRunner} from '../runner';

export interface INpmOptions {
    npmCommand: string;
    cwd: string;
}


export abstract class INpm {
    abstract async build(options: INpmOptions): Promise<void>;

    abstract async install(options: INpmOptions): Promise<void>;

    abstract async test(options: INpmOptions): Promise<void>;
}

export class Npm extends INpm {

    constructor(private runner: IRunner) {
        super();
    }

    async build({npmCommand, cwd}: INpmOptions): Promise<void> {
        await this.runner.executeCommand({
            command: [npmCommand, 'run', 'build'],
            execOptions: {
                cwd,
            },
        });
    }

    async install({npmCommand, cwd}: INpmOptions): Promise<void> {
        await this.runner.executeCommand({
            command: [npmCommand, 'install'],
            execOptions: {
                cwd,
            },
        });
    }

    async test({npmCommand, cwd}: INpmOptions): Promise<void> {
        await this.runner.executeCommand({
            command: [npmCommand, 'run', 'test'],
            execOptions: {
                cwd,
            },
        });
    }

}

