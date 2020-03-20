import { injectable } from 'inversify';
import { ILoggerFactory } from '../interfaces/loggerFactory';
// @ts-ignore
import { Consola, ConsolaOptions, FancyReporter } from 'consola';
import { memoize } from '../../memoize/memoize';
import { ILoggerSettings } from '../interfaces/loggerSettings';
import * as chalk from 'chalk';
import { ILogger, LogLevel } from '../interfaces/logger';
import { Logger } from './logger';

@injectable()
export class LoggerFactory extends ILoggerFactory {
  private readonly options: ConsolaOptions;
  constructor(settings: ILoggerSettings) {
    super();
    process.stdout.columns = process.stdout.columns || 200;
    const isDebug = settings.debugMode;
    const isTrace = settings.traceMode;
    const level = isTrace ? LogLevel.TRACE : isDebug ? LogLevel.DEBUG : LogLevel.INFO;
    this.options = {
      level,
      reporters: [new FancyReporter()],
    };
  }

  @memoize((category) => category)
  public getLogger(category: string): ILogger {
    return new Logger({
      ...this.options,
      defaults: {
        level: this.options.level,
        message: `${chalk.bgCyan(category)}: `,
      },
    });
  }
}
