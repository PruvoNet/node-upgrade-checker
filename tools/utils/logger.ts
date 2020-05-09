import { LoggerFactory } from '../../src/utils/logger/impl/loggerFactory';
import { ILoggerFactory, ILoggerSettings, LogLevel } from '../../src/utils/logger';
import * as fs from 'fs';

export const loggerSettings: ILoggerSettings = {
  logLevel: LogLevel.TRACE,
  logFile: undefined,
  customLogFile: undefined,
};
export const loggerFactory: ILoggerFactory = new LoggerFactory(loggerSettings, process, fs);
