import {injectable} from 'inversify';

export interface ICacheResolverOptions {
    repo: {
        name: string;
        version: string;
    };
    targetNode: string;
}

export interface ICacheResolverResult {
    isMatch: boolean;
    resolverName?: string;
}

@injectable()
export abstract class ICacheResolver {
    public abstract async resolve(options: ICacheResolverOptions): Promise<ICacheResolverResult>;
}

