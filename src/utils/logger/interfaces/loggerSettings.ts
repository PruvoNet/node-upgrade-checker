import { injectable } from 'inversify';

@injectable()
export abstract class ILoggerSettings {
  public abstract readonly debugMode: boolean;
  public abstract readonly traceMode: boolean;
}
