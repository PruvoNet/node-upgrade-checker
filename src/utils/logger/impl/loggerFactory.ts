import { injectable } from 'inversify';
import { ILoggerFactory } from '../interfaces/ILoggerFactory';
import { ConsolaOptions } from 'consola';
import { memoize } from '../../memoize/memoize';
import { ILoggerSettings } from '../interfaces/ILoggerSettings';
import * as chalk from 'chalk';
import { ILogger, LogLevel } from '../interfaces/ILogger';
import { Logger } from './logger';
import { LogReporter } from './logReporter';
import { getConoslaLogLevel } from './logLevel';

@injectable()
export class LoggerFactory extends ILoggerFactory {
  private readonly options: ConsolaOptions;
  constructor({ logLevel }: ILoggerSettings) {
    super();
    this.options = {
      level: getConoslaLogLevel(logLevel ?? LogLevel.INFO),
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
