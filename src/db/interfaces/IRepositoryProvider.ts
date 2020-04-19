import { Repository } from 'typeorm';
import { IEntity } from './IEntity';

export abstract class IRepositoryProvider<T extends IEntity> {
  public abstract async getRepository(): Promise<Repository<T>>;
}
