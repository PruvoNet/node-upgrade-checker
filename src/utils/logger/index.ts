import { interfaces } from 'inversify';
import Bind = interfaces.Bind;
import { LoggerFactory } from './impl/loggerFactory';
import { ILoggerFactory } from './interfaces/loggerFactory';

export const loggerModuleBinder = (bind: Bind): void => {
  bind<ILoggerFactory>(ILoggerFactory)
    .to(LoggerFactory)
    .inSingletonScope();
};

export * from './interfaces/loggerFactory';
export * from './interfaces/loggerSettings';
