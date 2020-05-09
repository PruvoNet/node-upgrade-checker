import { inject, injectable } from 'inversify';
import { ILoggerFactory } from '../interfaces/ILoggerFactory';
import { Consola, ConsolaOptions, ConsolaReporter } from 'consola';
import { memoize } from '../../memoize/memoize';
import { ILoggerSettings, LogLevel } from '../interfaces/ILoggerSettings';
import { ILogger } from '../interfaces/ILogger';
import * as chalk from 'chalk';
import { LogReporter } from './logReporter';
import { getConoslaLogLevel } from './logLevel';
import { JsonLogReporter } from './jsonLogReporter';
import { PassThrough } from 'stream';
import { FS, TYPES } from '../../../container/nodeModulesContainer';
import Process = NodeJS.Process;

const fileStreamOptions = {
  encoding: `utf8`,
  flags: `w`,
};

@injectable()
export class LoggerFactory extends ILoggerFactory {
  private readonly options: ConsolaOptions;

  constructor(
    { logLevel, logFile, customLogFile }: ILoggerSettings,
    @inject(TYPES.Process) private readonly process: Process,
    @inject(TYPES.FS) private readonly fs: FS
  ) {
    super();
    const level = getConoslaLogLevel(logLevel ?? LogLevel.INFO);
    let stdout: NodeJS.WritableStream = this.process.stdout;
    let stderr: NodeJS.WritableStream = this.process.stderr;
    const reporters: ConsolaReporter[] = [
      new LogReporter({
        secondaryColor: `grey`,
        bgColor: `bgGrey`,
        level,
      }),
    ];
    if (customLogFile) {
      stdout = this.fs.createWriteStream(customLogFile, fileStreamOptions);
      const pass = new PassThrough();
      pass.pipe(stderr);
      pass.pipe(stdout);
      stderr = pass;
    }
    if (logFile) {
      const stream = this.fs.createWriteStream(logFile, fileStreamOptions);
      reporters.push(
        new JsonLogReporter({
          stream,
        })
      );
    }
    this.options = {
      level: logFile ? getConoslaLogLevel(LogLevel.VERBOSE) : level,
      reporters,
      stdout,
      stderr,
    };
  }

  @memoize((category: string): string => category)
  public getLogger(category: string): ILogger {
    return new Consola({
      ...this.options,
      defaults: {
        message: `${chalk.cyan(category)}`,
      },
    });
  }
}
