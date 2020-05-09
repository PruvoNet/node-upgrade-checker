import { LogLevel as ConsolaLogLevel } from 'consola';
import { LogLevel } from '../interfaces/ILogger';

const logLevelMap = {
  [LogLevel.ERROR]: ConsolaLogLevel.Error,
  [LogLevel.WARN]: ConsolaLogLevel.Warn,
  [LogLevel.LOG]: ConsolaLogLevel.Log,
  [LogLevel.INFO]: ConsolaLogLevel.Info,
  [LogLevel.DEBUG]: ConsolaLogLevel.Debug,
  [LogLevel.TRACE]: ConsolaLogLevel.Trace,
  [LogLevel.SILENT]: -ConsolaLogLevel.Silent, // Hack until the issue in conosla is fixed
  [LogLevel.VERBOSE]: ConsolaLogLevel.Silent, // Hack until the issue in conosla is fixed
};

export const getConoslaLogLevel = (level: LogLevel): ConsolaLogLevel => logLevelMap[level];
