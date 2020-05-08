import { LoggerFactory } from '../../src/utils/logger/impl/loggerFactory';
import { ILoggerFactory, ILoggerSettings } from '../../src/utils/logger';
import { LogLevel } from '../../src/utils/logger/interfaces/ILogger';

export const loggerSettings: ILoggerSettings = {
  logLevel: LogLevel.TRACE,
};
export const loggerFactory: ILoggerFactory = new LoggerFactory(loggerSettings);
