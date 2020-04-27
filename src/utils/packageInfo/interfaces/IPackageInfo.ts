import { Moment } from 'moment';

export interface IPackageVersionOptions {
  name: string;
  semver: string;
}

export interface IPackageInfoOptions {
  name: string;
  version: string;
}

export interface IPackageInfoResult {
  name: string;
  version: string;
  engines?: string;
  repoUrl?: string;
  repoDirectory?: string;
  commitSha?: string;
  releaseDate?: Moment;
}

export abstract class IPackageInfo {
  public abstract async resolvePackageVersion(options: IPackageVersionOptions): Promise<string>;
  public abstract async getPackageInfo(options: IPackageInfoOptions): Promise<IPackageInfoResult>;
}
