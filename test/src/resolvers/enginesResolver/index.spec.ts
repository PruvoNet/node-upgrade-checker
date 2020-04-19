import { BindingTypes, testBindings } from '../../../common/testers/bindingTester';
import { enginesResolveModulesBinder, IEnginesResolver } from '../../../../src/resolvers/enginesResolver';
import { EnginesResolver } from '../../../../src/resolvers/enginesResolver/impl/enginesResolver';

testBindings({
  name: `engines resolver module container`,
  binderFn: enginesResolveModulesBinder,
  bindings: [
    {
      binder: IEnginesResolver,
      binded: EnginesResolver,
      type: BindingTypes.SINGELTON,
    },
  ],
});
