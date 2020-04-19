import { ICIResolver } from './interfaces/ICIResolver';
import { CiResolver } from './impl/ciResolver';
import { ISpecificCIResolver } from './interfaces/ISpecificCIResolver';
import { CircleCiResolver } from './impl/resolvers/circleci/circleCiResolver';
import { GithubActionsResolver } from './impl/resolvers/githubActions/githubActionsResolver';
import { ITargetMatcher } from './interfaces/ITargetMatcher';
import { TargetMatcher } from './impl/targetMatcher';
import { AppVeyorResolver } from './impl/resolvers/appveyor/appVeyorResolver';
import { interfaces } from 'inversify';
import Bind = interfaces.Bind;
import { SpecificCIResolverRunner } from './impl/specificCIResolverRunner';
import { ISpecificCIResolverRunner } from './interfaces/ISpecificCIResolverRunner';
import { AppVeyorConfigParser } from './impl/resolvers/appveyor/appVeyorConfigParser';
import { CircleCiConfigParser } from './impl/resolvers/circleci/circleCiConfigParser';
import { TravisCiConfigParser } from './impl/resolvers/travisci/travisCiConfigParser';
import { TravisCiResolver } from './impl/resolvers/travisci/travisCiResolver';
import { GithubActionsConfigParser } from './impl/resolvers/githubActions/githubActionsConfigParser';
import { namedOrMultiConstraint } from '../../container/utils';
import { INvmHandler } from './interfaces/INvmHandler';
import { NvmHandler } from './impl/nvmHandler';

export const SpecificCIResolverTags = {
  travisCi: TravisCiResolver.TAG,
  appVeyor: AppVeyorResolver.TAG,
  circleCi: CircleCiResolver.TAG,
  githubActions: GithubActionsResolver.TAG,
};

export const ciResolverModulesBinder = (bind: Bind): void => {
  bind<INvmHandler>(INvmHandler).to(NvmHandler).inSingletonScope();
  bind<ITargetMatcher>(ITargetMatcher).to(TargetMatcher).inSingletonScope();
  bind<ICIResolver>(ISpecificCIResolverRunner).to(SpecificCIResolverRunner).inSingletonScope();
  bind<ICIResolver>(ICIResolver).to(CiResolver).inSingletonScope();
  bind<ISpecificCIResolver>(ISpecificCIResolver)
    .to(TravisCiResolver)
    .inSingletonScope()
    .when(namedOrMultiConstraint(SpecificCIResolverTags.travisCi, ISpecificCIResolver));
  bind<ISpecificCIResolver>(ISpecificCIResolver)
    .to(AppVeyorResolver)
    .inSingletonScope()
    .when(namedOrMultiConstraint(SpecificCIResolverTags.appVeyor, ISpecificCIResolver));
  bind<ISpecificCIResolver>(ISpecificCIResolver)
    .to(CircleCiResolver)
    .inSingletonScope()
    .when(namedOrMultiConstraint(SpecificCIResolverTags.circleCi, ISpecificCIResolver));
  bind<ISpecificCIResolver>(ISpecificCIResolver)
    .to(GithubActionsResolver)
    .inSingletonScope()
    .when(namedOrMultiConstraint(SpecificCIResolverTags.githubActions, ISpecificCIResolver));
  bind<AppVeyorConfigParser>(AppVeyorConfigParser).toSelf().inSingletonScope();
  bind<CircleCiConfigParser>(CircleCiConfigParser).toSelf().inSingletonScope();
  bind<TravisCiConfigParser>(TravisCiConfigParser).toSelf().inSingletonScope();
  bind<GithubActionsConfigParser>(GithubActionsConfigParser).toSelf().inSingletonScope();
};

export * from './interfaces/ISpecificCIResolver';
export * from './interfaces/ITargetMatcher';
export * from './interfaces/ICIResolver';
