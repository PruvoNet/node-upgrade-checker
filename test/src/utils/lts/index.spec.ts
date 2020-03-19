import { BindingTypes, testBindings } from '../../../common/bindingTester';
import { ILts, ltsModulesBinder } from '../../../../src/utils/lts';
import { Lts } from '../../../../src/utils/lts/impl/lts';

testBindings({
  name: `lts module container`,
  binderFn: ltsModulesBinder,
  bindings: [
    {
      binder: ILts,
      binded: Lts,
      type: BindingTypes.SINGELTON,
    },
  ],
});
