export interface IResolverPositiveResult {
  isMatch: true;
  resolverName: string;
}

export interface IResolverNegativeResult {
  isMatch: false;
}

export type IResolverResult = IResolverNegativeResult | IResolverPositiveResult;
