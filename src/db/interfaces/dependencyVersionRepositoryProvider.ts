import {injectable} from 'inversify';
import {Repository} from 'typeorm';
import {DependencyVersion} from '../entities/dependencyVersion';

@injectable()
export abstract class IDependencyVersionRepositoryProvider {

    public abstract async getRepository(): Promise<Repository<DependencyVersion>>;
}
