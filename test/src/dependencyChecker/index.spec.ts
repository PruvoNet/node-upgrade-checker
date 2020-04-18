import { BindingTypes, testBindings } from '../../common/testers/bindingTester';
import { dependencyCheckerModulesBinder, IDependencyChecker, IPackageInfoCache } from '../../../src/dependencyChecker';
import { DependencyChecker } from '../../../src/dependencyChecker/impl/dependencyChecker';
import { PackageInfoCache } from '../../../src/dependencyChecker/impl/packageInfoCache';

testBindings({
  name: `dependency checker module container`,
  binderFn: dependencyCheckerModulesBinder,
  bindings: [
    {
      binder: IDependencyChecker,
      binded: DependencyChecker,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: IPackageInfoCache,
      binded: PackageInfoCache,
      type: BindingTypes.SINGELTON,
    },
  ],
});
