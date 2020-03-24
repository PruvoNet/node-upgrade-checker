import { injectable } from 'inversify';
import { IConnectionProvider } from '../interfaces/IConnectionProvider';
import { AbstractRepositoryProvider } from './AbstractRepositoryProvider';
import { DependencyVersion } from '../entities/dependencyVersion';

@injectable()
export class DependencyVersionRepositoryProvider extends AbstractRepositoryProvider<DependencyVersion> {
  constructor(connectionProvider: IConnectionProvider) {
    super(connectionProvider, DependencyVersion);
  }
}
