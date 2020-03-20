import { injectable } from 'inversify';
import { IResolverResult } from '../../types';

export interface IEnginesResolverOptions {
  engines: string | undefined;
  targetNode: string;
}

@injectable()
export abstract class IEnginesResolver {
  public abstract async resolve(options: IEnginesResolverOptions): Promise<IResolverResult>;
}
