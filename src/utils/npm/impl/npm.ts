import { IRunner } from '../../runner';
import { INpm, INpmOptions } from '../interfaces/npm';
import { injectable } from 'inversify';

@injectable()
export class Npm extends INpm {
  constructor(private runner: IRunner) {
    super();
  }

  async install({ cwd }: INpmOptions): Promise<void> {
    await this.runner.executeCommand({
      command: [`npm`, `install`],
      execOptions: {
        cwd,
      },
    });
  }

  async build({ cwd }: INpmOptions): Promise<void> {
    await this.runner.executeCommand({
      command: [`npm`, `run`, `build`],
      execOptions: {
        cwd,
      },
    });
  }

  async test({ cwd }: INpmOptions): Promise<void> {
    await this.runner.executeCommand({
      command: [`npm`, `run`, `test`],
      execOptions: {
        cwd,
      },
    });
  }
}
