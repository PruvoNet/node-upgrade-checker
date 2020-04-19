export interface ISpecificCIResolverOptions {
  repoPath: string;
}

export interface ISpecificCIResolverResponse {
  nodeVersions: Set<string>;
}

export abstract class ISpecificCIResolver {
  public abstract async isRelevant(options: ISpecificCIResolverOptions): Promise<boolean>;
  public abstract async resolve(options: ISpecificCIResolverOptions): Promise<ISpecificCIResolverResponse>;
  public abstract readonly resolverName: string;
}
