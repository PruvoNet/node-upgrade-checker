import { IResolverResult } from '../../types';
import { Moment } from 'moment';

export interface ICIResolveOptions {
  repoPath: string;
  targetNode: string;
  packageReleaseDate: Moment;
}

export abstract class ICIResolver {
  public abstract async resolve(options: ICIResolveOptions): Promise<IResolverResult>;
}
