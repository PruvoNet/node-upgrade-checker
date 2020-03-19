import { BindingTypes, testBindings } from '../../../common/bindingTester';
import { IRunner, runnerModuleBinder } from '../../../../src/utils/runner';
import { Runner } from '../../../../src/utils/runner/impl/runner';

testBindings({
  name: `runner module container`,
  binderFn: runnerModuleBinder,
  bindings: [
    {
      binder: IRunner,
      binded: Runner,
      type: BindingTypes.SINGELTON,
    },
  ],
});
