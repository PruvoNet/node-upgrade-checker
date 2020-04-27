import { ConnectionOptions } from 'typeorm';

export abstract class IConnectionOptionsProvider {
  public abstract getConnectionOptions(): ConnectionOptions;
}
