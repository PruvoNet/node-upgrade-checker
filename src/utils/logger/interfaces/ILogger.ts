export enum LogLevel {
  ERROR,
  WARN,
  LOG,
  INFO,
  DEBUG,
  TRACE,
}

export interface ILogger {
  fatal(...args: any[]): void;

  error(...args: any[]): void;

  warn(...args: any[]): void;

  log(...args: any[]): void;

  info(...args: any[]): void;

  success(...args: any[]): void;

  debug(...args: any[]): void;

  trace(...args: any[]): void;

  isDebugEnabled(): boolean;
  isTraceEnabled(): boolean;
  isInfoEnabled(): boolean;
  isWarnEnabled(): boolean;
  isLevelEnabled(level: LogLevel): boolean;
}
