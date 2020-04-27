export interface ICacheResolverOptions {
  repo: {
    name: string;
    version: string;
  };
  targetNode: string;
}

export interface ICacheResolverResultMatch {
  isMatch: true;
}

export interface ICacheResolverResultMatchPositive extends ICacheResolverResultMatch {
  result: true;
  resolverName: string;
}

export interface ICacheResolverResultMatchNegative extends ICacheResolverResultMatch {
  result: false;
}

export interface ICacheResolverResultNoMatch {
  isMatch: false;
}

export type ICacheResolverResult =
  | ICacheResolverResultNoMatch
  | ICacheResolverResultMatchPositive
  | ICacheResolverResultMatchNegative;

export abstract class ICacheResolver {
  public abstract async resolve(options: ICacheResolverOptions): Promise<ICacheResolverResult>;
}
