import { ILogger } from './ILogger';

export abstract class ILoggerFactory {
  public abstract getLogger(category: string): ILogger;
}
