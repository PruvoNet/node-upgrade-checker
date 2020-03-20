import { injectable, optional } from 'inversify';
import { ILoggerFactory } from '../interfaces/loggerFactory';
// @ts-ignore
import { Consola, FancyReporter } from 'consola';
import { memoize } from '../../memoize/memoize';
import { ILoggerSettings } from '../interfaces/loggerSettings';

@injectable()
export class LoggerFactory extends ILoggerFactory {
  constructor(@optional() private settings?: ILoggerSettings) {
    super();
  }

  @memoize()
  public getLogger(): Consola {
    const isDebug = this.settings?.debugMode;
    const isTrace = !this.settings || this.settings.traceMode;
    return new Consola({
      level: isTrace ? 5 : isDebug ? 4 : 3,
      reporters: [new FancyReporter()],
    });
  }
}
