import { injectable } from 'inversify';
import { ILogger } from './ILogger';

@injectable()
export abstract class ILoggerFactory {
  public abstract getLogger(category: string): ILogger;
}
