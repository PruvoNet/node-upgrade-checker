import {ContainerModule} from 'inversify';
import * as fs from 'fs';
import * as yaml from 'yaml';
import {FS, TYPES, Yaml} from './types';
import {ICIResolver} from './interfaces/cIResolver';
import {CiResolver} from './impl/ciResolver';
import {ISpecificCIResolver} from './interfaces/specificCIResolver';
import {TravisCiResolver} from './impl/resolvers/travis';
import {CircleCiResolver} from './impl/resolvers/circle';
import {GithubActionsResolver} from './impl/resolvers/github';
import {ITargetMatcher} from './interfaces/targetMatcher';
import {TargetMatcher} from './impl/targetMatcher';

export const ciResolverContainerModule = new ContainerModule((bind) => {
    bind<FS>(TYPES.FS).toConstantValue(fs);
    bind<Yaml>(TYPES.YAML).toConstantValue(yaml);
    bind<ICIResolver>(ICIResolver).to(CiResolver).inSingletonScope();
    bind<ITargetMatcher>(ITargetMatcher).to(TargetMatcher).inSingletonScope();
    bind<TravisCiResolver>(TravisCiResolver).to(TravisCiResolver).inSingletonScope();
    bind<ISpecificCIResolver>(ISpecificCIResolver).to(TravisCiResolver).inSingletonScope();
    bind<ISpecificCIResolver>(ISpecificCIResolver).to(CircleCiResolver).inSingletonScope();
    bind<CircleCiResolver>(CircleCiResolver).to(CircleCiResolver).inSingletonScope();
    bind<ISpecificCIResolver>(ISpecificCIResolver).to(GithubActionsResolver).inSingletonScope();
    bind<ISpecificCIResolver>(GithubActionsResolver).to(GithubActionsResolver).inSingletonScope();
});

export * from './interfaces/specificCIResolver';
export * from './interfaces/targetMatcher';
export * from './interfaces/cIResolver';
