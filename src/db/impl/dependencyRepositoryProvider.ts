import { injectable } from 'inversify';
import { IConnectionProvider } from '../interfaces/IConnectionProvider';
import { AbstractRepositoryProvider } from './AbstractRepositoryProvider';
import { Dependency } from '../entities/dependency';

@injectable()
export class DependencyRepositoryProvider extends AbstractRepositoryProvider<Dependency> {
  constructor(connectionProvider: IConnectionProvider) {
    super(connectionProvider, Dependency);
  }
}
