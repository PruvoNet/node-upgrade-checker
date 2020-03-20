import { inject, injectable } from 'inversify';
import { Commit, Reference, Repository } from 'nodegit';
import {
  CloneRepoOptions,
  ICheckoutCommitOptions,
  ICheckoutReferenceOptions,
  IGit,
  ILocateCommitOptions,
  ILocateTagOptions,
  IOpenRepoOptions,
} from '../interfaces/git';
import { NodeGit, TYPES } from '../../../container/nodeModulesContainer';
import { ILoggerFactory } from '../../logger';
import { ILogger } from '../../logger/interfaces/logger';

@injectable()
export class Git extends IGit {
  private readonly logger: ILogger;
  constructor(@inject(TYPES.NodeGit) private readonly nodeGit: NodeGit, loggerFactory: ILoggerFactory) {
    super();
    this.logger = loggerFactory.getLogger(`Git`);
  }

  public async checkoutCommit({ repo, commit }: ICheckoutCommitOptions): Promise<void> {
    this.logger.debug(`Checking out commit ${commit.id().tostrS()}`);
    await this.nodeGit.Reset.reset(repo, commit, this.nodeGit.Reset.TYPE.HARD, {
      checkoutStrategy: this.nodeGit.Checkout.STRATEGY.SAFE,
    });
    this.logger.debug(`Checked out commit ${commit.id().tostrS()}`);
  }

  public async checkoutReference({ repo, reference }: ICheckoutReferenceOptions): Promise<void> {
    this.logger.debug(`Checking out reference ${reference.toString()}`);
    await repo.checkoutRef(reference);
    this.logger.debug(`Checked out reference ${reference.toString()}`);
  }

  public async cloneRepo({ url, dir }: CloneRepoOptions): Promise<Repository> {
    this.logger.info(`Cloning repo ${url}`);
    this.logger.debug(`Cloning repo to ${dir}`);
    const repo = await this.nodeGit.Clone.clone(url, dir);
    this.logger.success(`Cloned repo ${url}`);
    return repo;
  }

  public async locateCommit({ repo, commitSha }: ILocateCommitOptions): Promise<Commit> {
    this.logger.debug(`Locating commit ${commitSha}`);
    try {
      const id = this.nodeGit.Oid.fromString(commitSha);
      this.logger.debug(`Located commit ${commitSha}, getting id`);
      const commit = await repo.getCommit(id);
      this.logger.debug(`Located commit id ${commit.id().tostrS()}`);
      return commit;
    } catch (e) {
      this.logger.debug(`Failed to locate commit ${commitSha}`, e);
      throw new Error(`Failed to locate commit ${commitSha}`);
    }
  }

  public async locateTag({ repo, tag }: ILocateTagOptions): Promise<Reference> {
    this.logger.debug(`Locating all references of repo ${repo.getNamespace()}`);
    const refs = await repo.getReferences();
    this.logger.debug(`Located ${refs.length} references`);
    const tagRefs = refs.filter((ref) => ref.isTag());
    this.logger.debug(`Located ${refs.length} tags. Looking for tag ${tag}`);
    const filteredTags = tagRefs.filter((currentTag) => {
      return currentTag.name().includes(tag);
    });
    this.logger.debug(`Located ${filteredTags.length} matching tag(s)`);
    if (filteredTags.length > 1) {
      this.logger.debug(`Too many matching tags`);
      throw new Error(`Too many matching tags for tag ${tag} - ${filteredTags}`);
    }
    const tagRef = filteredTags[0];
    if (!tagRef) {
      this.logger.debug(`No matching tags`);
      throw new Error(`Failed to locate tag ${tag}`);
    }
    this.logger.debug(`Located matching tag ${tagRef.toString()}`);
    return tagRef;
  }

  public async openRepo({ path }: IOpenRepoOptions): Promise<Repository> {
    this.logger.debug(`Opening existing repo in ${path}`);
    const repo = await this.nodeGit.Repository.open(path);
    this.logger.debug(`Opened repo`);
    return repo;
  }
}
