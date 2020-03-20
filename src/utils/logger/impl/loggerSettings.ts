import { injectable } from 'inversify';
import { ILoggerSettings } from '../interfaces/loggerSettings';

@injectable()
export class LoggerSettings extends ILoggerSettings {
  constructor(public readonly debugMode: boolean) {
    super();
  }
}
