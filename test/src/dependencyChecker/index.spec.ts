import { BindingTypes, testBindings } from '../../common/testers/bindingTester';
import { dependencyCheckerModulesBinder, IDependencyChecker } from '../../../src/dependencyChecker';
import { DependencyChecker } from '../../../src/dependencyChecker/impl/dependencyChecker';

testBindings({
  name: `dependency checker module container`,
  binderFn: dependencyCheckerModulesBinder,
  bindings: [
    {
      binder: IDependencyChecker,
      binded: DependencyChecker,
      type: BindingTypes.SINGELTON,
    },
  ],
});
