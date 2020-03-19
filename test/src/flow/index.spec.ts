import { BindingTypes, testBindings } from '../../utils/bindingTester';
import { flowModulesBinder, IFlow } from '../../../src/flow';
import { Flow } from '../../../src/flow/impl/flow';

testBindings({
  name: `flow module container`,
  binderFn: flowModulesBinder,
  bindings: [
    {
      binder: IFlow,
      binded: Flow,
      type: BindingTypes.SINGELTON,
    },
  ],
});
