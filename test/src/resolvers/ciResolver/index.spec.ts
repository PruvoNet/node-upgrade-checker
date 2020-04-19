import { BindingTypes, testBindings } from '../../../common/testers/bindingTester';
import {
  ciResolverModulesBinder,
  ICIResolver,
  ISpecificCIResolver,
  ITargetMatcher,
  SpecificCIResolverTags,
} from '../../../../src/resolvers/ciResolver';
import { CiResolver } from '../../../../src/resolvers/ciResolver/impl/ciResolver';
import { TargetMatcher } from '../../../../src/resolvers/ciResolver/impl/targetMatcher';
import { AppVeyorResolver } from '../../../../src/resolvers/ciResolver/impl/resolvers/appveyor/appVeyorResolver';
import { CircleCiResolver } from '../../../../src/resolvers/ciResolver/impl/resolvers/circleci/circleCiResolver';
import { GithubActionsResolver } from '../../../../src/resolvers/ciResolver/impl/resolvers/githubActions/githubActionsResolver';
import { ISpecificCIResolverRunner } from '../../../../src/resolvers/ciResolver/interfaces/ISpecificCIResolverRunner';
import { SpecificCIResolverRunner } from '../../../../src/resolvers/ciResolver/impl/specificCIResolverRunner';
import { AppVeyorConfigParser } from '../../../../src/resolvers/ciResolver/impl/resolvers/appveyor/appVeyorConfigParser';
import { CircleCiConfigParser } from '../../../../src/resolvers/ciResolver/impl/resolvers/circleci/circleCiConfigParser';
import { TravisCiConfigParser } from '../../../../src/resolvers/ciResolver/impl/resolvers/travisci/travisCiConfigParser';
import { TravisCiResolver } from '../../../../src/resolvers/ciResolver/impl/resolvers/travisci/travisCiResolver';
import { GithubActionsConfigParser } from '../../../../src/resolvers/ciResolver/impl/resolvers/githubActions/githubActionsConfigParser';
import { INvmHandler } from '../../../../src/resolvers/ciResolver/interfaces/INvmHandler';
import { NvmHandler } from '../../../../src/resolvers/ciResolver/impl/nvmHandler';

testBindings({
  name: `ci resolver module container`,
  binderFn: ciResolverModulesBinder,
  bindings: [
    {
      binder: INvmHandler,
      binded: NvmHandler,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: ITargetMatcher,
      binded: TargetMatcher,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: ISpecificCIResolverRunner,
      binded: SpecificCIResolverRunner,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: ICIResolver,
      binded: CiResolver,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: ISpecificCIResolver,
      binded: TravisCiResolver,
      type: BindingTypes.SINGELTON,
      multi: true,
      tag: SpecificCIResolverTags.travisCi,
    },
    {
      binder: ISpecificCIResolver,
      binded: AppVeyorResolver,
      type: BindingTypes.SINGELTON,
      multi: true,
      tag: SpecificCIResolverTags.appVeyor,
    },
    {
      binder: ISpecificCIResolver,
      binded: CircleCiResolver,
      type: BindingTypes.SINGELTON,
      multi: true,
      tag: SpecificCIResolverTags.circleCi,
    },
    {
      binder: ISpecificCIResolver,
      binded: GithubActionsResolver,
      type: BindingTypes.SINGELTON,
      multi: true,
      tag: SpecificCIResolverTags.githubActions,
    },
    {
      binder: AppVeyorConfigParser,
      binded: BindingTypes.SELF,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: CircleCiConfigParser,
      binded: BindingTypes.SELF,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: TravisCiConfigParser,
      binded: BindingTypes.SELF,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: GithubActionsConfigParser,
      binded: BindingTypes.SELF,
      type: BindingTypes.SINGELTON,
    },
  ],
});
