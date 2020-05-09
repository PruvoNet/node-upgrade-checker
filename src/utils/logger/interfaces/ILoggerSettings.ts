export enum LogLevel {
  ERROR,
  WARN,
  LOG,
  INFO,
  DEBUG,
  TRACE,
  SILENT,
  VERBOSE,
}

export abstract class ILoggerSettings {
  public abstract readonly logLevel: LogLevel | undefined;
  public abstract readonly logFile: string | undefined;
  public abstract readonly customLogFile: string | undefined;
}
