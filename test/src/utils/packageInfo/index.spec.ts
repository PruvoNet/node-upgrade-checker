import { BindingTypes, testBindings } from '../../../common/testers/bindingTester';
import { INpmConfigRetriever, IPackageInfo, packageInfoModulesBinder } from '../../../../src/utils/packageInfo';
import { PackageInfo } from '../../../../src/utils/packageInfo/impl/packageInfo';
import { NpmConfigRetriever } from '../../../../src/utils/packageInfo/impl/npmConfigRetriever';

testBindings({
  name: `package info module container`,
  binderFn: packageInfoModulesBinder,
  bindings: [
    {
      binder: INpmConfigRetriever,
      binded: NpmConfigRetriever,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: IPackageInfo,
      binded: PackageInfo,
      type: BindingTypes.SINGELTON,
    },
  ],
});
