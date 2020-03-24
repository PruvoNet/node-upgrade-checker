export interface ICacheResolverOptions {
  repo: {
    name: string;
    version: string;
  };
  targetNode: string;
}

export interface ICacheResolverPositiveResult {
  isMatch: true;
  result: boolean;
  resolverName: string;
}

export interface ICacheResolverNegativeResult {
  isMatch: false;
}

export type ICacheResolverResult = ICacheResolverNegativeResult | ICacheResolverPositiveResult;

export abstract class ICacheResolver {
  public abstract async resolve(options: ICacheResolverOptions): Promise<ICacheResolverResult>;
}
