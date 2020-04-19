import { BindingTypes, testBindings } from '../../../common/testers/bindingTester';
import { INodeVersions, nodeVersionsModulesBinder } from '../../../../src/utils/nodeVersions';
import { NodeVersions } from '../../../../src/utils/nodeVersions/impl/nodeVersions';

testBindings({
  name: `lts module container`,
  binderFn: nodeVersionsModulesBinder,
  bindings: [
    {
      binder: INodeVersions,
      binded: NodeVersions,
      type: BindingTypes.SINGELTON,
    },
  ],
});
