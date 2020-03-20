import { injectable } from 'inversify';
import { Consola } from 'consola';

@injectable()
export abstract class ILoggerFactory {
  public static LEVELS = {
    INFO: 3,
    DEBUG: 4,
    TRACE: 5,
  };
  public abstract isDebugEnabled(): boolean;
  public abstract isTraceEnabled(): boolean;
  public abstract getLogger(): Consola;
}
