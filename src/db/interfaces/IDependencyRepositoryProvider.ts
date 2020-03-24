import { Dependency } from '../entities/dependency';
import { IRepositoryProvider } from './IRepositoryProvider';

export abstract class IDependencyRepositoryProvider extends IRepositoryProvider<Dependency> {}
