import {ContainerModule} from 'inversify';
import {ICIResolver} from './interfaces/cIResolver';
import {CiResolver} from './impl/ciResolver';
import {ISpecificCIResolver} from './interfaces/specificCIResolver';
import {TravisCiResolver} from './impl/resolvers/travis';
import {CircleCiResolver} from './impl/resolvers/circle';
import {GithubActionsResolver} from './impl/resolvers/github';
import {ITargetMatcher} from './interfaces/targetMatcher';
import {TargetMatcher} from './impl/targetMatcher';
import {AppVeyorResolver} from './impl/resolvers/appveyor';

export const ciResolverContainerModule = new ContainerModule((bind) => {
    bind<ICIResolver>(ICIResolver).to(CiResolver).inSingletonScope();
    bind<ITargetMatcher>(ITargetMatcher).to(TargetMatcher).inSingletonScope();
    bind<TravisCiResolver>(TravisCiResolver).to(TravisCiResolver).inSingletonScope();
    bind<AppVeyorResolver>(AppVeyorResolver).to(AppVeyorResolver).inSingletonScope();
    bind<ISpecificCIResolver>(ISpecificCIResolver).to(TravisCiResolver).inSingletonScope();
    bind<ISpecificCIResolver>(ISpecificCIResolver).to(AppVeyorResolver).inSingletonScope();
    bind<ISpecificCIResolver>(ISpecificCIResolver).to(CircleCiResolver).inSingletonScope();
    bind<CircleCiResolver>(CircleCiResolver).to(CircleCiResolver).inSingletonScope();
    bind<ISpecificCIResolver>(ISpecificCIResolver).to(GithubActionsResolver).inSingletonScope();
    bind<ISpecificCIResolver>(GithubActionsResolver).to(GithubActionsResolver).inSingletonScope();
});

export * from './interfaces/specificCIResolver';
export * from './interfaces/targetMatcher';
export * from './interfaces/cIResolver';
