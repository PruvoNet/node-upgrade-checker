import {injectable} from 'inversify';
import {IResolverResult} from '../../types';

export interface ICIResolveOptions {
    repoPath: string;
    targetNode: string;
}

@injectable()
export abstract class ICIResolver {
    public abstract async resolve(options: ICIResolveOptions): Promise<IResolverResult>;
}

