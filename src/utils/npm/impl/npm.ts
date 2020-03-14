import {IRunner} from '../../runner';
import {INpm, INpmOptions} from '../interfaces/npm';
import {injectable} from 'inversify';

@injectable()
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

