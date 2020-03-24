import { BindingTypes, testBindings } from '../../../common/testers/bindingTester';
import { IPackageInfo, packageInfoModulesBinder } from '../../../../src/utils/packageInfo';
import { PackageInfo } from '../../../../src/utils/packageInfo/impl/packageInfo';

testBindings({
  name: `package info module container`,
  binderFn: packageInfoModulesBinder,
  bindings: [
    {
      binder: IPackageInfo,
      binded: PackageInfo,
      type: BindingTypes.SINGELTON,
    },
  ],
});
