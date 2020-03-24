import { DependencyVersion } from '../entities/dependencyVersion';
import { IRepositoryProvider } from './IRepositoryProvider';

export abstract class IDependencyVersionRepositoryProvider extends IRepositoryProvider<DependencyVersion> {}
