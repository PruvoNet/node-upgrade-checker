import { IResolverResult } from '../../types';

export interface IEnginesResolverOptions {
  engines: string | undefined;
  targetNode: string;
}

export abstract class IEnginesResolver {
  public abstract async resolve(options: IEnginesResolverOptions): Promise<IResolverResult>;
}
