import { LogLevel as ConsolaLogLevel } from 'consola';
import { LogLevel } from '../interfaces/ILoggerSettings';

const logLevelMap = {
  [LogLevel.ERROR]: ConsolaLogLevel.Error,
  [LogLevel.WARN]: ConsolaLogLevel.Warn,
  [LogLevel.LOG]: ConsolaLogLevel.Log,
  [LogLevel.INFO]: ConsolaLogLevel.Info,
  [LogLevel.DEBUG]: ConsolaLogLevel.Debug,
  [LogLevel.TRACE]: ConsolaLogLevel.Trace,
  [LogLevel.SILENT]: -ConsolaLogLevel.Silent,
  [LogLevel.VERBOSE]: ConsolaLogLevel.Verbose,
};

export const getConoslaLogLevel = (level: LogLevel): ConsolaLogLevel => logLevelMap[level];
