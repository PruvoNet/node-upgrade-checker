import { Consola, ConsolaOptions } from 'consola';
import { ILogger, LogLevel } from '../interfaces/ILogger';
import { getConoslaLogLevel } from './logLevel';

export class Logger extends Consola implements ILogger {
  constructor(options: ConsolaOptions) {
    super(options);
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

  public isLogEnabled(): boolean {
    return this.isLevelEnabled(LogLevel.LOG);
  }

  public isErrorEnabled(): boolean {
    return this.isLevelEnabled(LogLevel.ERROR);
  }

  public isSilent(): boolean {
    return this.level === getConoslaLogLevel(LogLevel.SILENT);
  }

  private isLevelEnabled(level: LogLevel): boolean {
    return this.level >= getConoslaLogLevel(level);
  }
}
