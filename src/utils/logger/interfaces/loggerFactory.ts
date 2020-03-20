import { injectable } from 'inversify';
import { Consola } from 'consola';

@injectable()
export abstract class ILoggerFactory {
  public abstract getLogger(): Consola;
}
