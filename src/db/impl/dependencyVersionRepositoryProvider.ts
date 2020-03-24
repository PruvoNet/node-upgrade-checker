import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { DependencyVersion } from '../entities/dependencyVersion';
import { IDependencyVersionRepositoryProvider } from '../interfaces/IDependencyVersionRepositoryProvider';
import { memoize } from '../../utils/memoize/memoize';
import { IConnectionProvider } from '../interfaces/IConnectionProvider';

@injectable()
export class DependencyVersionRepositoryProvider extends IDependencyVersionRepositoryProvider {
  constructor(private connectionProvider: IConnectionProvider) {
    super();
  }

  @memoize()
  public async getRepository(): Promise<Repository<DependencyVersion>> {
    const connection = await this.connectionProvider.getConnection();
    return connection.getRepository(DependencyVersion);
  }
}
