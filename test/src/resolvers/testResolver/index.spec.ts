import { BindingTypes, testBindings } from '../../../common/bindingTester';
import { ITestResolver, testResolverModulesBinder } from '../../../../src/resolvers/testResolver';
import { TestResolver } from '../../../../src/resolvers/testResolver/impl/testResolver';

testBindings({
  name: `test resolver module container`,
  binderFn: testResolverModulesBinder,
  bindings: [
    {
      binder: ITestResolver,
      binded: TestResolver,
      type: BindingTypes.SINGELTON,
    },
  ],
});
