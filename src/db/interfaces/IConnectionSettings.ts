import { injectable } from 'inversify';

@injectable()
export abstract class IConnectionSettings {
  public abstract readonly databaseFilePath: string;
  public abstract readonly dropSchema: boolean;
}
