export interface ILogger {
  fatal(...args: unknown[]): void;

  error(...args: unknown[]): void;

  warn(...args: unknown[]): void;

  log(...args: unknown[]): void;

  info(...args: unknown[]): void;

  success(...args: unknown[]): void;

  debug(...args: unknown[]): void;

  trace(...args: unknown[]): void;
}
