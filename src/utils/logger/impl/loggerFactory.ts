import { injectable } from 'inversify';
import { ILoggerFactory } from '../interfaces/ILoggerFactory';
import { ConsolaOptions } from 'consola';
import { memoize } from '../../memoize/memoize';
import { ILoggerSettings } from '../interfaces/ILoggerSettings';
import * as chalk from 'chalk';
import { ILogger, LogLevel } from '../interfaces/ILogger';
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
      reporters: [
        new LogReporter({
          secondaryColor: `grey`,
          bgColor: `bgGrey`,
        }),
      ],
    };
  }

  @memoize((category: string): string => category)
  public getLogger(category: string): ILogger {
    return new Logger({
      ...this.options,
      defaults: {
        message: `${chalk.cyan(category)}`,
      },
    });
  }
}
