import { Consola, ConsolaOptions } from 'consola';
import { ILogger, LogLevel } from '../interfaces/ILogger';

export class Logger extends Consola implements ILogger {
  constructor(options: ConsolaOptions) {
    super(options);
  }

  public isLevelEnabled(level: LogLevel): boolean {
    return this.level >= level;
  }

  public isTraceEnabled(): boolean {
    return this.isLevelEnabled(LogLevel.TRACE);
  }

  public isDebugEnabled(): boolean {
    return this.isLevelEnabled(LogLevel.DEBUG);
  }

  public isInfoEnabled(): boolean {
    return this.isLevelEnabled(LogLevel.INFO);
  }

  public isWarnEnabled(): boolean {
    return this.isLevelEnabled(LogLevel.WARN);
  }
}
