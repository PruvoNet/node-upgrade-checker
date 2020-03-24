import { Dependency } from '../entities/dependency';
import { injectable } from 'inversify';
import { Repository } from 'typeorm';

@injectable()
export abstract class IDependencyRepositoryProvider {
  public abstract async getRepository(): Promise<Repository<Dependency>>;
}
