import { interfaces } from 'inversify';
import Bind = interfaces.Bind;
import { LoggerFactory } from './impl/loggerFactory';
import { ILoggerFactory } from './interfaces/loggerFactory';
import { LoggerSettings } from './impl/loggerSettings';
import { ILoggerSettings } from './interfaces/loggerSettings';

export const loggerModuleBinder = (bind: Bind): void => {
  bind<ILoggerSettings>(ILoggerSettings)
    .to(LoggerSettings)
    .inSingletonScope();
  bind<ILoggerFactory>(ILoggerFactory)
    .to(LoggerFactory)
    .inSingletonScope();
};

export * from './interfaces/loggerFactory';
export * from './interfaces/loggerSettings';
export * from './impl/loggerSettings';
