import { ICIResolver } from './interfaces/cIResolver';
import { CiResolver } from './impl/ciResolver';
import { ISpecificCIResolver } from './interfaces/specificCIResolver';
import { TravisCiResolver } from './impl/resolvers/travis';
import { CircleCiResolver } from './impl/resolvers/circle';
import { GithubActionsResolver } from './impl/resolvers/github';
import { ITargetMatcher } from './interfaces/targetMatcher';
import { TargetMatcher } from './impl/targetMatcher';
import { AppVeyorResolver } from './impl/resolvers/appveyor';
import { interfaces } from 'inversify';
import Bind = interfaces.Bind;

export const ciResolverModulesBinder = (bind: Bind): void => {
  bind<ICIResolver>(ICIResolver)
    .to(CiResolver)
    .inSingletonScope();
  bind<ITargetMatcher>(ITargetMatcher)
    .to(TargetMatcher)
    .inSingletonScope();
  bind<ISpecificCIResolver>(ISpecificCIResolver)
    .to(TravisCiResolver)
    .inSingletonScope();
  bind<ISpecificCIResolver>(ISpecificCIResolver)
    .to(AppVeyorResolver)
    .inSingletonScope();
  bind<ISpecificCIResolver>(ISpecificCIResolver)
    .to(CircleCiResolver)
    .inSingletonScope();
  bind<ISpecificCIResolver>(ISpecificCIResolver)
    .to(GithubActionsResolver)
    .inSingletonScope();
};

export * from './interfaces/specificCIResolver';
export * from './interfaces/targetMatcher';
export * from './interfaces/cIResolver';
