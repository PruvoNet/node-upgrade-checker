import { injectable } from 'inversify';
import { ILogger } from './logger';

@injectable()
export abstract class ILoggerFactory {
  public abstract getLogger(category: string): ILogger;
}
