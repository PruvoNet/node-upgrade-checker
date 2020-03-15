import {injectable} from 'inversify';
import {ConnectionProvider} from './connectionProvider';
import {Repository} from 'typeorm';
import {DependencyVersion} from '../entities/dependencyVersion';
import {IDependencyVersionRepositoryProvider} from '../interfaces/dependencyVersionRepositoryProvider';

@injectable()
export class DependencyVersionRepositoryProvider extends IDependencyVersionRepositoryProvider{

    private repository?: Repository<DependencyVersion>;

    constructor(private connectionProvider: ConnectionProvider) {
        super();
    }

    public async getRepository(): Promise<Repository<DependencyVersion>> {
        if (this.repository) {
            return this.repository;
        }
        const connection = await this.connectionProvider.getConnection();
        this.repository = connection.getRepository(DependencyVersion);
        return this.repository;
    }
}
