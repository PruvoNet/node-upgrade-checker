import { LoggerFactory } from '../../src/utils/logger/impl/loggerFactory';
import { ILoggerFactory, LoggerSettings } from '../../src/utils/logger';

export const loggerFactory: ILoggerFactory = new LoggerFactory(new LoggerSettings(true, true));
