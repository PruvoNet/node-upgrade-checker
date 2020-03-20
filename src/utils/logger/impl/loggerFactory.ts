import { injectable, optional } from 'inversify';
import { ILoggerFactory } from '../interfaces/loggerFactory';
import { Consola } from 'consola';
import { memoize } from '../../memoize/memoize';
import { ILoggerSettings } from '../interfaces/loggerSettings';

@injectable()
export class LoggerFactory extends ILoggerFactory {
  constructor(@optional() private settings?: ILoggerSettings) {
    super();
  }

  @memoize()
  public getLogger(): Consola {
    const isDebug = !this.settings || this.settings.debugMode;
    return new Consola({
      level: isDebug ? 4 : 3,
    });
  }
}
