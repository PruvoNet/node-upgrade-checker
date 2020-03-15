import {IRunner} from '../../runner';
import {INpm, INpmOptions} from '../interfaces/npm';
import {injectable} from 'inversify';
import * as path from 'path';

@injectable()
export class Npm extends INpm {

    constructor(private runner: IRunner) {
        super();
    }

    async install({nvmBinDir, cwd}: INpmOptions): Promise<void> {
        await this.runner.executeCommand({
            command: [path.join(nvmBinDir, 'npm'), 'install'],
            execOptions: {
                cwd,
            },
        });
    }

    async build({nvmBinDir, cwd}: INpmOptions): Promise<void> {
        await this.runner.executeCommand({
            command: [path.join(nvmBinDir, 'npm'), 'run', 'build'],
            execOptions: {
                cwd,
            },
        });
    }

    async test({nvmBinDir, cwd}: INpmOptions): Promise<void> {
        await this.runner.executeCommand({
            command: [path.join(nvmBinDir, 'npm'), 'run', 'test'],
            execOptions: {
                cwd,
            },
        });
    }

}

