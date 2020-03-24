export interface IPackageInfoOptions {
  name: string;
  semver: string;
}

export interface IPackageInfoResult {
  name: string;
  semver: string;
  version: string;
  engines?: string;
  repoUrl?: string;
  commitSha?: string;
}

export abstract class IPackageInfo {
  public abstract async getPackageInfo(options: IPackageInfoOptions): Promise<IPackageInfoResult>;
}
