import { interfaces } from 'inversify';
import Bind = interfaces.Bind;
import { LoggerFactory } from './impl/loggerFactory';
import { ILoggerFactory } from './interfaces/ILoggerFactory';

export const loggerModuleBinder = (bind: Bind): void => {
  bind<ILoggerFactory>(ILoggerFactory).to(LoggerFactory).inSingletonScope();
};

export * from './interfaces/ILoggerFactory';
export * from './interfaces/ILoggerSettings';
export * from './interfaces/ILogger';
