export enum LogLevel {
  ERROR,
  WARN,
  LOG,
  INFO,
  DEBUG,
  TRACE,
  SILENT,
}

export interface ILogger {
  fatal(...args: unknown[]): void;

  error(...args: unknown[]): void;

  warn(...args: unknown[]): void;

  log(...args: unknown[]): void;

  info(...args: unknown[]): void;

  success(...args: unknown[]): void;

  debug(...args: unknown[]): void;

  trace(...args: unknown[]): void;

  isDebugEnabled(): boolean;
  isTraceEnabled(): boolean;
  isInfoEnabled(): boolean;
  isWarnEnabled(): boolean;
  isLevelEnabled(level: LogLevel): boolean;
}
