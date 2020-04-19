import { Moment } from 'moment';
import { IResolverResult } from '../../types';
import { ISpecificCIResolver } from './ISpecificCIResolver';

export interface ISpecificCIResolverRunnerOptions {
  repoPath: string;
  targetNode: string;
  packageReleaseDate: Moment;
  resolver: ISpecificCIResolver;
}

export abstract class ISpecificCIResolverRunner {
  public abstract async resolve(options: ISpecificCIResolverRunnerOptions): Promise<IResolverResult>;
}
