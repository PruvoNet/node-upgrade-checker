import { BindingTypes, testBindings } from '../../../common/bindingTester';
import { INpm, npmModulesBinder } from '../../../../src/utils/npm';
import { Npm } from '../../../../src/utils/npm/impl/npm';

testBindings({
  name: `npm module container`,
  binderFn: npmModulesBinder,
  bindings: [
    {
      binder: INpm,
      binded: Npm,
      type: BindingTypes.SINGELTON,
    },
  ],
});
