import { IResolverResult } from '../../types';
import { Moment } from 'moment';

export interface IEnginesResolverOptions {
  engines: string | undefined;
  targetNode: string;
  releaseDate: Moment | undefined;
}

export abstract class IEnginesResolver {
  public abstract async resolve(options: IEnginesResolverOptions): Promise<IResolverResult>;
}
