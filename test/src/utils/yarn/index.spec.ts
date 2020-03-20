import { BindingTypes, testBindings } from '../../../common/bindingTester';
import { IYarn, yarnModulesBinder } from '../../../../src/utils/yarn';
import { Yarn } from '../../../../src/utils/yarn/impl/yarn';

testBindings({
  name: `yarn module container`,
  binderFn: yarnModulesBinder,
  bindings: [
    {
      binder: IYarn,
      binded: Yarn,
      type: BindingTypes.SINGELTON,
    },
  ],
});
