import { DependencyVersion } from '../../../../src/db';
import { DependencyVersionRepositoryProvider } from '../../../../src/db/impl/dependencyVersionRepositoryProvider';
import { testRepositoryProvider } from '../../../common/testers/repositoryProviderTester';

testRepositoryProvider(DependencyVersion, DependencyVersionRepositoryProvider);
