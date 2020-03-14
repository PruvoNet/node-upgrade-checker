import {injectable} from 'inversify';
import {IResolverResult} from '../../types';

export interface ITestResolverOptions {
    repoPath: string;
    npmCommand: string;
}

@injectable()
export abstract class ITestResolver {
    public abstract async resolve(options: ITestResolverOptions): Promise<IResolverResult>;
}

