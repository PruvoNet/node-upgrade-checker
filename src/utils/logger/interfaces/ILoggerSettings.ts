import { LogLevel } from './ILogger';

export abstract class ILoggerSettings {
  public abstract readonly logLevel: LogLevel | undefined;
}
