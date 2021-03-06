import { ICommandRunner } from '../../commandRunner';
import { IYarn, IYarnOptions } from '../interfaces/IYarn';
import { injectable } from 'inversify';
import { ILoggerFactory, ILogger } from '../../logger';

@injectable()
export class Yarn extends IYarn {
  private logger: ILogger;
  constructor(private runner: ICommandRunner, loggerFactory: ILoggerFactory) {
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
