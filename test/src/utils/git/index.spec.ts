import { BindingTypes, testBindings } from '../../../utils/bindingTester';
import { gitModuleBinder, IGit, IGitCheckout } from '../../../../src/utils/git';
import { Git } from '../../../../src/utils/git/impl/git';
import { GitCheckout } from '../../../../src/utils/git/impl/gitCheckout';

testBindings({
  name: `git module container`,
  binderFn: gitModuleBinder,
  bindings: [
    {
      binder: IGit,
      binded: Git,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: IGitCheckout,
      binded: GitCheckout,
      type: BindingTypes.SINGELTON,
    },
  ],
});
