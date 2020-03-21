import { BindingTypes, testBindings } from '../../../common/bindingTester';
import { gitModuleBinder, IGitCheckout } from '../../../../src/utils/git';
import { Git } from '../../../../src/utils/git/impl/git';
import { GitCheckout } from '../../../../src/utils/git/impl/gitCheckout';

testBindings({
  name: `git module container`,
  binderFn: gitModuleBinder,
  bindings: [
    {
      binder: Git,
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
