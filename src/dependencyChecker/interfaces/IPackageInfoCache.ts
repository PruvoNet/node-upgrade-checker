import { DependencyVersion } from '../../db';

export interface IPackageInfoCacheOptions {
  name: string;
  semver: string;
}

export interface IUpdateCommitShaOptions {
  dependencyVersion: DependencyVersion;
  commitSha: string;
}

export interface IUpdateTestScriptOptions {
  dependencyVersion: DependencyVersion;
  testScript: string;
}

export interface IUpdateRepoDirectoryOptions {
  dependencyVersion: DependencyVersion;
  repoDirectory: string;
}

export interface IUpdateBuildScriptOptions {
  dependencyVersion: DependencyVersion;
  buildScript: string;
}

export abstract class IPackageInfoCache {
  public abstract async getPackageInfo(options: IPackageInfoCacheOptions): Promise<DependencyVersion>;
  public abstract async updateCommitSha(options: IUpdateCommitShaOptions): Promise<void>;
  public abstract async updateTestScript(options: IUpdateTestScriptOptions): Promise<void>;
  public abstract async updateRepoDirectory(options: IUpdateRepoDirectoryOptions): Promise<void>;
  public abstract async updateBuildScript(options: IUpdateBuildScriptOptions): Promise<void>;
}
