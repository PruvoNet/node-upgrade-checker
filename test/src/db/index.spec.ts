import {
  dbModulesBinder,
  Dependency,
  DependencyVersion,
  IConnectionProvider,
  IDependencyRepositoryProvider,
  IDependencyVersionRepositoryProvider,
} from '../../../src/db';
import { DependencyRepositoryProvider } from '../../../src/db/impl/dependencyRepositoryProvider';
import { DependencyVersionRepositoryProvider } from '../../../src/db/impl/dependencyVersionRepositoryProvider';
import { ConnectionProvider } from '../../../src/db/impl/connectionProvider';
import { IEntity } from '../../../src/db/interfaces/IEntity';
import { BindingTypes, testBindings } from '../../common/bindingTester';

testBindings({
  name: `db module container`,
  binderFn: dbModulesBinder,
  bindings: [
    {
      binder: IDependencyRepositoryProvider,
      binded: DependencyRepositoryProvider,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: IDependencyVersionRepositoryProvider,
      binded: DependencyVersionRepositoryProvider,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: IConnectionProvider,
      binded: ConnectionProvider,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: IEntity,
      binded: Dependency,
      type: BindingTypes.CONSTANT,
    },
    {
      binder: IEntity,
      binded: DependencyVersion,
      type: BindingTypes.CONSTANT,
    },
  ],
});
