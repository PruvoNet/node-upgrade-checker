import {injectable} from 'inversify';
import {ConnectionProvider} from './connectionProvider';
import {Repository} from 'typeorm';
import {DependencyVersion} from '../entities/dependencyVersion';
import {IDependencyVersionRepositoryProvider} from '../interfaces/dependencyVersionRepositoryProvider';
import {memoize} from '../../utils/memoize/memoize';

@injectable()
export class DependencyVersionRepositoryProvider extends IDependencyVersionRepositoryProvider{

    constructor(private connectionProvider: ConnectionProvider) {
        super();
    }

    @memoize()
    public async getRepository(): Promise<Repository<DependencyVersion>> {
        const connection = await this.connectionProvider.getConnection();
        return connection.getRepository(DependencyVersion);
    }
}
