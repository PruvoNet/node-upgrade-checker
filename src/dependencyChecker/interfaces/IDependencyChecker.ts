import { Moment } from 'moment';

export enum DependencyType {
  PROD = `production`,
  DEV = `development`,
  PEER = `peer`,
}

export interface IDependencyCheckerRunOptions {
  pkg: {
    version: string;
    name: string;
    releaseDate: Moment;
    dependencyType: DependencyType;
  };
  repo: {
    url: string;
    commitSha?: string;
  };
  workDir: string;
  targetNode: string;
  skip: {
    cache: {
      ignoreAll: boolean;
      ignoreFalsy: boolean;
      ignoreTruthy: boolean;
    };
    yarnTest: boolean;
  };
}

export interface IDependencyCheckerRunResult {
  isMatch: boolean;
  resolverName?: string;
}

export abstract class IDependencyChecker {
  public abstract async run(options: IDependencyCheckerRunOptions): Promise<IDependencyCheckerRunResult>;
}
