import { Repository } from 'typeorm';
import { memoize } from '../../utils/memoize/memoize';
import { IEntity } from '../interfaces/IEntity';
import { IConnectionProvider } from '..';
import { IRepositoryProvider } from '../interfaces/IRepositoryProvider';

export abstract class AbstractRepositoryProvider<T extends IEntity> extends IRepositoryProvider<T> {
  protected constructor(
    private readonly connectionProvider: IConnectionProvider,
    private readonly Entity: new () => T
  ) {
    super();
  }

  @memoize()
  public async getRepository(): Promise<Repository<T>> {
    const connection = await this.connectionProvider.getConnection();
    return connection.getRepository(this.Entity);
  }
}
