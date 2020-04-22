export enum DependencyType {
  PROD = `production`,
  DEV = `development`,
  PEER = `peer`,
  OPTIONAL = `optional`,
  GLOBAL = `global`,
}

export interface IDependency {
  semver: string;
  name: string;
  dependencyType: DependencyType;
}

export interface IPackageData {
  dependencies: Set<IDependency>;
}
