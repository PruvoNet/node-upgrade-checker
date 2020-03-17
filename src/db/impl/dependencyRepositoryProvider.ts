import {Dependency} from '../entities/dependency';
import {injectable} from 'inversify';
import {ConnectionProvider} from './connectionProvider';
import {Repository} from 'typeorm';
import {IDependencyRepositoryProvider} from '../interfaces/dependencyRepositoryProvider';
import {memoize} from '../../utils/memoize/memoize';

@injectable()
export class DependencyRepositoryProvider extends IDependencyRepositoryProvider{

    constructor(private connectionProvider: ConnectionProvider) {
        super();
    }

    @memoize()
    public async getRepository(): Promise<Repository<Dependency>> {
        const connection = await this.connectionProvider.getConnection();
        return connection.getRepository(Dependency);
    }
}
