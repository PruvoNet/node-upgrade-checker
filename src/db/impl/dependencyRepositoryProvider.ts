import { Dependency } from '../entities/dependency';
import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { IDependencyRepositoryProvider } from '../interfaces/IDependencyRepositoryProvider';
import { memoize } from '../../utils/memoize/memoize';
import { IConnectionProvider } from '../interfaces/IConnectionProvider';

@injectable()
export class DependencyRepositoryProvider extends IDependencyRepositoryProvider {
  constructor(private connectionProvider: IConnectionProvider) {
    super();
  }

  @memoize()
  public async getRepository(): Promise<Repository<Dependency>> {
    const connection = await this.connectionProvider.getConnection();
    return connection.getRepository(Dependency);
  }
}
