import { injectable } from 'inversify';
import { IConnectionSettings } from '../interfaces/connectionSettings';

@injectable()
export class ConnectionSettings extends IConnectionSettings {
  constructor(public readonly databaseFilePath: string, public readonly dropSchema: boolean) {
    super();
  }
}
