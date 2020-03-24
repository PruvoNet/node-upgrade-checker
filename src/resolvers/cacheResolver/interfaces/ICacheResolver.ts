import { injectable } from 'inversify';
import { IResolverResult } from '../../types';

export interface ICacheResolverOptions {
  repo: {
    name: string;
    version: string;
  };
  targetNode: string;
}

@injectable()
export abstract class ICacheResolver {
  public abstract async resolve(options: ICacheResolverOptions): Promise<IResolverResult>;
}
