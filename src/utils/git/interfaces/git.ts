import {Commit, Reference, Repository} from 'nodegit';
import {injectable} from 'inversify';

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
    abstract async checkoutCommit(options: ICheckoutCommitOptions): Promise<void>;

    abstract async checkoutReference(options: ICheckoutReferenceOptions): Promise<void>;

    abstract async cloneRepo(options: CloneRepoOptions): Promise<Repository>;

    abstract async locateCommit(options: ILocateCommitOptions): Promise<Commit>;

    abstract async locateTag(options: ILocateTagOptions): Promise<Reference>;

    abstract async openRepo(options: IOpenRepoOptions): Promise<Repository>;
}
