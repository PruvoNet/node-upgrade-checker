import { Commit, Reference, Repository } from 'nodegit';
import { injectable } from 'inversify';

export interface ICheckoutCommitOptions {
  repo: Repository;
  commit: Commit;
}

export interface ICheckoutReferenceOptions {
  repo: Repository;
  reference: Reference;
}

export interface CloneRepoOptions {
  url: string;
  dir: string;
}

export interface ILocateCommitOptions {
  repo: Repository;
  commitSha: string;
}

export interface ILocateTagOptions {
  repo: Repository;
  tag: string;
}

export interface IOpenRepoOptions {
  path: string;
}

@injectable()
export abstract class IGit {
  public abstract async checkoutCommit(options: ICheckoutCommitOptions): Promise<void>;

  public abstract async checkoutReference(options: ICheckoutReferenceOptions): Promise<void>;

  public abstract async cloneRepo(options: CloneRepoOptions): Promise<Repository>;

  public abstract async locateCommit(options: ILocateCommitOptions): Promise<Commit>;

  public abstract async locateTag(options: ILocateTagOptions): Promise<Reference>;

  public abstract async openRepo(options: IOpenRepoOptions): Promise<Repository>;
}
