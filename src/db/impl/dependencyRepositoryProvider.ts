import {Dependency} from '../entities/dependency';
import {injectable} from 'inversify';
import {ConnectionProvider} from './connectionProvider';
import {Repository} from 'typeorm';
import {IDependencyRepositoryProvider} from '../interfaces/dependencyRepositoryProvider';

@injectable()
export class DependencyRepositoryProvider extends IDependencyRepositoryProvider{

    private repository?: Repository<Dependency>;

    constructor(private connectionProvider: ConnectionProvider) {
        super();
    }

    public async getRepository(): Promise<Repository<Dependency>> {
        if (this.repository) {
            return this.repository;
        }
        const connection = await this.connectionProvider.getConnection();
        this.repository = connection.getRepository(Dependency);
        return this.repository;
    }
}
