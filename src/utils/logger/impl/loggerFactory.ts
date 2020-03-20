import { injectable } from 'inversify';
import { ILoggerFactory } from '../interfaces/loggerFactory';
import { ConsolaOptions } from 'consola';
import { memoize } from '../../memoize/memoize';
import { ILoggerSettings } from '../interfaces/loggerSettings';
import * as chalk from 'chalk';
import { ILogger, LogLevel } from '../interfaces/logger';
import { Logger } from './logger';
import { LogReporter } from './logReporter';

@injectable()
export class LoggerFactory extends ILoggerFactory {
  private readonly options: ConsolaOptions;
  constructor(settings: ILoggerSettings) {
    super();
    const isDebug = settings.debugMode;
    const isTrace = settings.traceMode;
    const level = isTrace ? LogLevel.TRACE : isDebug ? LogLevel.DEBUG : LogLevel.INFO;
    this.options = {
      level,
      reporters: [new LogReporter()],
    };
  }

  @memoize((category) => category)
  public getLogger(category: string): ILogger {
    return new Logger({
      ...this.options,
      defaults: {
        message: `${chalk.bgCyan(category)}`,
      },
    });
  }
}
