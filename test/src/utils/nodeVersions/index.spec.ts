import { BindingTypes, testBindings } from '../../../common/testers/bindingTester';
import { INodeVersions, nodeVersionsModulesBinder } from '../../../../src/utils/nodeVersions';
import { NodeVersions } from '../../../../src/utils/nodeVersions/impl/nodeVersions';

testBindings({
  name: `node version module container`,
  binderFn: nodeVersionsModulesBinder,
  bindings: [
    {
      binder: INodeVersions,
      binded: NodeVersions,
      type: BindingTypes.SINGELTON,
    },
  ],
});
