export enum DependencyType {
  PROD = `production`,
  DEV = `development`,
  PEER = `peer`,
}

export interface IDependencyCheckerRunOptions {
  pkg: {
    semver: string;
    name: string;
    dependencyType: DependencyType;
  };
  workDir: string;
  targetNode: string;
  skip: {
    cache: {
      ignoreAll: boolean;
      ignoreFalsy: boolean;
    };
    packageCache: boolean;
    yarnTest: boolean;
  };
}

export interface IDependencyCheckerRunPositiveResult {
  isMatch: true;
  resolverName: string;
}

export interface IDependencyCheckerRunFalsyResult {
  isMatch: false;
}

export interface IDependencyCheckerRunErrorResult {
  isError: true;
  reason: string;
}

export type IDependencyCheckerRunResult =
  | IDependencyCheckerRunPositiveResult
  | IDependencyCheckerRunFalsyResult
  | IDependencyCheckerRunErrorResult;

export abstract class IDependencyChecker {
  public abstract async run(options: IDependencyCheckerRunOptions): Promise<IDependencyCheckerRunResult>;
}
