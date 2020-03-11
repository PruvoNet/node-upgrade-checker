import {inject, injectable} from 'inversify';
import {Commit, Reference, Repository} from 'nodegit';
import {NodeGit, TYPES} from './types';

interface ICheckoutCommitOptions {
    repo: Repository;
    commit: Commit;
}

interface ICheckoutReferenceOptions {
    repo: Repository;
    reference: Reference;
}

interface CloneRepoOptions {
    url: string;
    dir: string;
}

interface ILocateCommitOptions {
    repo: Repository;
    commitSha: string;
}

interface ILocateTagOptions {
    repo: Repository;
    tag: string;
}

interface IOpenRepoOptions {
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

@injectable()
export class Git extends IGit {

    constructor(@inject(TYPES.NodeGit) private nodeGit: NodeGit) {
        super();
    }

    public async checkoutCommit({repo, commit}: ICheckoutCommitOptions): Promise<void> {
        await this.nodeGit.Reset.reset(repo, commit, this.nodeGit.Reset.TYPE.HARD,
            {checkoutStrategy: this.nodeGit.Checkout.STRATEGY.SAFE});
    }

    public async checkoutReference({repo, reference}: ICheckoutReferenceOptions): Promise<void> {
        await repo.checkoutRef(reference);
    }

    public async cloneRepo({url, dir}: CloneRepoOptions): Promise<Repository> {
        return await this.nodeGit.Clone.clone(url, dir);
    }

    public async locateCommit({repo, commitSha}: ILocateCommitOptions): Promise<Commit> {
        try {
            const id = this.nodeGit.Oid.fromString(commitSha);
            return await repo.getCommit(id);
        } catch (e) {
            throw new Error(`Failed to locate commit ${commitSha}`);
        }
    }

    public async locateTag({repo, tag}: ILocateTagOptions): Promise<Reference> {
        const refs = await repo.getReferences();
        const tagRefs = refs.filter((ref) => ref.isTag());
        const filteredTags = tagRefs.filter((currentTag) => {
            return currentTag.name().includes(tag);
        });
        if (filteredTags.length > 1) {
            throw new Error(`Too many matching tags for tag ${tag} - ${filteredTags}`);
        }
        const tagRef = filteredTags[0];
        if (!tagRef) {
            throw new Error(`Failed to locate tag ${tag}`);
        }
        return tagRef;
    }

    public async openRepo({path}: IOpenRepoOptions): Promise<Repository> {
        return await this.nodeGit.Repository.open(path);
    }

}
