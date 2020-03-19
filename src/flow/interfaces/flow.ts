import { injectable } from 'inversify';
import { Moment } from 'moment';

export interface IRunFlowOptions {
  pkg: {
    version: string;
    name: string;
    releaseDate: Moment;
  };
  repo: {
    url: string;
    commitSha?: string;
  };
  workDir: string;
  targetNode: string;
}

export interface IRunFlowResult {
  isMatch: boolean;
  resolverName?: string;
}

@injectable()
export abstract class IFlow {
  public abstract async runFlow(options: IRunFlowOptions): Promise<IRunFlowResult>;
}
