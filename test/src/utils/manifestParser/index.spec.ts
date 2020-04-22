import { BindingTypes, testBindings } from '../../../common/testers/bindingTester';
import {
  IManifestParser,
  INpmGlobalManifestParser,
  manifestParserModulesBinder,
} from '../../../../src/utils/manifestParser';
import { ManifestParser } from '../../../../src/utils/manifestParser/impl/manifestParser';
import { NpmGlobalManifestParser } from '../../../../src/utils/manifestParser/impl/npmGlobalManifestParser';

testBindings({
  name: `manifest parser module container`,
  binderFn: manifestParserModulesBinder,
  bindings: [
    {
      binder: IManifestParser,
      binded: ManifestParser,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: INpmGlobalManifestParser,
      binded: NpmGlobalManifestParser,
      type: BindingTypes.SINGELTON,
    },
  ],
});
