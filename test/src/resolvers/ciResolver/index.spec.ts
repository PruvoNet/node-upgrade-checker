import { BindingTypes, testBindings } from '../../../common/bindingTester';
import {
  ciResolverModulesBinder,
  ICIResolver,
  ISpecificCIResolver,
  ITargetMatcher,
} from '../../../../src/resolvers/ciResolver';
import { CiResolver } from '../../../../src/resolvers/ciResolver/impl/ciResolver';
import { TargetMatcher } from '../../../../src/resolvers/ciResolver/impl/targetMatcher';
import { TravisCiResolver } from '../../../../src/resolvers/ciResolver/impl/resolvers/travis';
import { AppVeyorResolver } from '../../../../src/resolvers/ciResolver/impl/resolvers/appveyor';
import { CircleCiResolver } from '../../../../src/resolvers/ciResolver/impl/resolvers/circle';
import { GithubActionsResolver } from '../../../../src/resolvers/ciResolver/impl/resolvers/github';

testBindings({
  name: `ci resolver module container`,
  binderFn: ciResolverModulesBinder,
  bindings: [
    {
      binder: ICIResolver,
      binded: CiResolver,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: ITargetMatcher,
      binded: TargetMatcher,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: ISpecificCIResolver,
      binded: TravisCiResolver,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: ISpecificCIResolver,
      binded: AppVeyorResolver,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: ISpecificCIResolver,
      binded: CircleCiResolver,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: ISpecificCIResolver,
      binded: GithubActionsResolver,
      type: BindingTypes.SINGELTON,
    },
  ],
});
