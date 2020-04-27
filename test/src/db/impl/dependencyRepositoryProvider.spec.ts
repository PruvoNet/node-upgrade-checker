import { Dependency } from '../../../../src/db';
import { DependencyRepositoryProvider } from '../../../../src/db/impl/dependencyRepositoryProvider';
import { testRepositoryProvider } from '../../../common/testers/repositoryProviderTester';

describe(`Dependency repository provider`, () => {
  testRepositoryProvider(Dependency, DependencyRepositoryProvider);
});
