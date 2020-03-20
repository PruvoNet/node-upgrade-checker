import { LoggerFactory } from '../../src/utils/logger/impl/loggerFactory';
import { ILoggerFactory, ILoggerSettings } from '../../src/utils/logger';

export const loggerSettings: ILoggerSettings = {
  debugMode: true,
  traceMode: true,
};
export const loggerFactory: ILoggerFactory = new LoggerFactory(loggerSettings);
