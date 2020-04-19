import { IResolverResult } from '../../types';

export interface ITestResolverOptions {
  repoPath: string;
}

export abstract class ITestResolver {
  public abstract async resolve(options: ITestResolverOptions): Promise<IResolverResult>;
}
