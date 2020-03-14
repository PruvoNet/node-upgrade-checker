import {injectable} from 'inversify';

export interface ICIResolveOptions {
    repoPath: string;
    targetNode: string;
}

export interface ICIResolveResult {
    isMatch: boolean;
    resolverName?: string;
}

@injectable()
export abstract class ICIResolver {
    public abstract async resolve(options: ICIResolveOptions): Promise<ICIResolveResult>;
}

