import { IRunner } from '../../runner';
import { IYarn, IYarnOptions } from '../interfaces/yarn';
import { injectable } from 'inversify';
import { ILoggerFactory } from '../../logger';
import { ILogger } from '../../logger/interfaces/logger';

@injectable()
export class Yarn extends IYarn {
  private logger: ILogger;
  constructor(private runner: IRunner, loggerFactory: ILoggerFactory) {
    super();
    this.logger = loggerFactory.getLogger(`Yarn`);
  }

  async install({ cwd }: IYarnOptions): Promise<void> {
    this.logger.info(`Running yarn install`);
    await this.runner.executeCommand({
      command: [`yarn`, `install`],
      execOptions: {
        cwd,
      },
    });
    this.logger.success(`yarn install ran successfully`);
  }

  async build({ cwd }: IYarnOptions): Promise<void> {
    this.logger.info(`Running yarn build`);
    await this.runner.executeCommand({
      command: [`yarn`, `run`, `build`],
      execOptions: {
        cwd,
      },
    });
    this.logger.success(`yarn build ran successfully`);
  }

  async test({ cwd }: IYarnOptions): Promise<void> {
    this.logger.info(`Running yarn test`);
    await this.runner.executeCommand({
      command: [`yarn`, `run`, `test`],
      execOptions: {
        cwd,
      },
    });
    this.logger.success(`yarn test ran successfully`);
  }
}
