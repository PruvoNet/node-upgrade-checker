import { injectable } from 'inversify';

@injectable()
export abstract class ILoggerSettings {
  public abstract readonly debugMode: boolean;
}
