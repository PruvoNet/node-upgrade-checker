import { LogLevel } from './ILogger';

export abstract class ILoggerSettings {
  public abstract readonly logLevel: LogLevel | undefined;
  public abstract readonly logFile: string | undefined;
  public abstract readonly customLogFile: string | undefined;
}
