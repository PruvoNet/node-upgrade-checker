import { injectable } from 'inversify';
import { ILoggerFactory } from '../interfaces/loggerFactory';
// @ts-ignore
import { Consola, FancyReporter } from 'consola';
import { memoize } from '../../memoize/memoize';
import { ILoggerSettings } from '../interfaces/loggerSettings';

@injectable()
export class LoggerFactory extends ILoggerFactory {
  constructor(private settings: ILoggerSettings) {
    super();
  }

  @memoize()
  public getLogger(): Consola {
    const isDebug = this.settings.debugMode;
    const isTrace = this.settings.traceMode;
    return new Consola({
      level: isTrace ? ILoggerFactory.LEVELS.TRACE : isDebug ? ILoggerFactory.LEVELS.DEBUG : ILoggerFactory.LEVELS.INFO,
      reporters: [new FancyReporter()],
    });
  }

  @memoize()
  public isDebugEnabled(): boolean {
    return this.getLogger().level >= ILoggerFactory.LEVELS.DEBUG;
  }

  @memoize()
  public isTraceEnabled(): boolean {
    return this.getLogger().level >= ILoggerFactory.LEVELS.TRACE;
  }
}
