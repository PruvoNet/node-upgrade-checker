import { Connection } from 'typeorm/connection/Connection';

export abstract class IConnectionProvider {
  public abstract async getConnection(): Promise<Connection>;
}
