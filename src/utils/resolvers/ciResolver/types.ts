export interface ICIResolverOptions {
    repoPath: string;
}

export interface ICIResolver {
    (options: ICIResolverOptions): Promise<string[] | undefined>;
    resolverName: string;
}

