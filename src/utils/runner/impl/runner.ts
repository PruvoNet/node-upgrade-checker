import { SpawnOptionsWithoutStdio } from 'child_process';
import { inject, injectable } from 'inversify';
import { IExecuteCommandOptions, IRunner } from '../interfaces/runner';
import { ChildProcess, TYPES } from '../../../container/nodeModulesContainer';
import { ILoggerFactory } from '../../logger';
import { Consola } from 'consola';

interface IPromisifiedSpawnOptions {
  command: string;
  options: string[];
  execOptions: SpawnOptionsWithoutStdio;
}

@injectable()
export class Runner extends IRunner {
  private logger: Consola;

  constructor(@inject(TYPES.ChildProcess) private childProcess: ChildProcess, loggerFactory: ILoggerFactory) {
    super();
    this.logger = loggerFactory.getLogger();
  }

  public async executeCommand({ command, execOptions }: IExecuteCommandOptions): Promise<void> {
    const firstCommand = command[0];
    const options = command.slice(1);
    await this.promisifiedSpawn({ command: firstCommand, options, execOptions });
  }

  private async promisifiedSpawn({ command, options, execOptions }: IPromisifiedSpawnOptions): Promise<void> {
    return await new Promise((resolve, reject) => {
      const subProcess = this.childProcess.spawn(command, options, execOptions);
      subProcess.stdout.on(`data`, (data) => {
        this.logger.trace(data.toString());
      });
      subProcess.stderr.on(`data`, (data) => {
        this.logger.error(data.toString());
      });
      subProcess.on(`error`, (err) => {
        console.error(`spawn error: `, err);
      });
      subProcess.on(`close`, (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`"${command} ${options.join(` `)}" exited with code: ${code}`));
        }
      });
    });
  }
}
