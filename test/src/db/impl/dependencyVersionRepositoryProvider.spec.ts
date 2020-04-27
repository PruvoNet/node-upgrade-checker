import { DependencyVersion } from '../../../../src/db';
import { testRepositoryProvider } from '../../../common/testers/repositoryProviderTester';
import { DependencyVersionRepositoryProvider } from '../../../../src/db/impl/dependencyVersionRepositoryProvider';

describe(`DependencyVersion repository provider`, () => {
  testRepositoryProvider(DependencyVersion, DependencyVersionRepositoryProvider);
});
