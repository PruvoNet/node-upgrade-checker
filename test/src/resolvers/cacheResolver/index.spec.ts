import { cacheResolveModulesBinder, ICacheResolver } from '../../../../src/resolvers/cacheResolver';
import { CacheResolver } from '../../../../src/resolvers/cacheResolver/impl/cacheResolver';
import { BindingTypes, testBindings } from '../../../utils/bindingTester';

testBindings({
  name: `cache resolver module container`,
  binderFn: cacheResolveModulesBinder,
  bindings: [
    {
      binder: ICacheResolver,
      binded: CacheResolver,
      type: BindingTypes.SINGELTON,
    },
  ],
});
