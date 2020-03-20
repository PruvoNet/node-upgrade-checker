import { SpawnOptionsWithoutStdio } from 'child_process';
import { inject, injectable } from 'inversify';
import { IExecuteCommandOptions, IRunner } from '../interfaces/runner';
import { ChildProcess, TYPES } from '../../../container/nodeModulesContainer';
import { ILoggerFactory } from '../../logger';
import { ILogger } from '../../logger/interfaces/logger';

interface IPromisifiedSpawnOptions {
  command: string;
  options: string[];
  execOptions: SpawnOptionsWithoutStdio;
}

@injectable()
export class Runner extends IRunner {
  private logger: ILogger;

  constructor(@inject(TYPES.ChildProcess) private childProcess: ChildProcess, loggerFactory: ILoggerFactory) {
    super();
    this.logger = loggerFactory.getLogger(`Command Runner`);
  }

  public async executeCommand({ command, execOptions }: IExecuteCommandOptions): Promise<void> {
    const firstCommand = command[0];
    const options = command.slice(1);
    if (this.logger.isDebugEnabled()) {
      this.logger.debug(`Running command ${command.join(` `)}`);
    }
    await this.promisifiedSpawn({ command: firstCommand, options, execOptions });
  }

  private async promisifiedSpawn({ command, options, execOptions }: IPromisifiedSpawnOptions): Promise<void> {
    return await new Promise((resolve, reject) => {
      const outputBuffer: Uint8Array[] = [];
      const errorBuffer: Uint8Array[] = [];
      const subProcess = this.childProcess.spawn(command, options, execOptions);
      subProcess.stdout.on(`data`, (data) => {
        if (this.logger.isDebugEnabled()) {
          outputBuffer.push(data);
        }
      });
      subProcess.stderr.on(`data`, (data) => {
        errorBuffer.push(data);
      });
      subProcess.on(`error`, (err) => {
        this.logger.error(`spawn error`, err);
      });
      subProcess.on(`close`, (code) => {
        if (this.logger.isDebugEnabled()) {
          const output = Buffer.concat(outputBuffer)
            .toString()
            .trim();
          if (output) {
            this.logger.debug(`Command output:\n`, output);
          }
          const errorOutput = Buffer.concat(errorBuffer)
            .toString()
            .trim();
          if (errorOutput) {
            this.logger.debug(`Command error output:\n`, errorOutput);
          }
        } else if (code !== 0) {
          const errorOutput = Buffer.concat(errorBuffer)
            .toString()
            .trim();
          if (errorOutput) {
            this.logger.error(`Command error output:\n`, errorOutput);
          }
        }
        if (this.logger.isDebugEnabled()) {
          this.logger.debug(`Command "${command} ${options.join(` `)}" finished with exit status ${code}`);
        }
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`"${command} ${options.join(` `)}" exited with code: ${code}`));
        }
      });
    });
  }
}
