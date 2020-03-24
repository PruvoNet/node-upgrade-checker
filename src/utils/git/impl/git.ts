import { inject, injectable } from 'inversify';
import { SimpleGitFn, TYPES } from '../../../container/nodeModulesContainer';
import { ILoggerFactory } from '../../logger';
import { ILogger } from '../../logger/interfaces/ILogger';
import { SimpleGit } from 'simple-git/promise';

export interface ICheckoutCommitOptions {
  repo: SimpleGit;
  commitSha: string;
}

export interface CloneRepoOptions {
  url: string;
  dir: string;
}

export interface ILocateTagOptions {
  repo: SimpleGit;
  tag: string;
}

export interface IOpenRepoOptions {
  path: string;
}

@injectable()
export class Git {
  private readonly logger: ILogger;
  constructor(@inject(TYPES.SimpleGit) private readonly git: SimpleGitFn, loggerFactory: ILoggerFactory) {
    this.logger = loggerFactory.getLogger(`Git`);
  }

  public async checkoutCommit({ repo, commitSha }: ICheckoutCommitOptions): Promise<void> {
    this.logger.info(`Checking out commit ${commitSha}`);
    try {
      await repo.checkout(commitSha);
    } catch (e) {
      this.logger.debug(`Failed Checking out commit ${commitSha}`, e);
      throw new Error(`Failed to checkout commit ${commitSha}`);
    }
    this.logger.success(`Checked out commit ${commitSha}`);
  }

  public async cloneRepo({ url, dir }: CloneRepoOptions): Promise<SimpleGit> {
    this.logger.info(`Cloning repo ${url}`);
    this.logger.debug(`Cloning repo to ${dir}`);
    const repo = this.git(dir);
    await repo.clone(url, dir);
    this.logger.success(`Cloned repo ${url}`);
    return repo;
  }

  public async locateTag({ repo, tag }: ILocateTagOptions): Promise<string> {
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    const repoName = repo._baseDir;
    this.logger.debug(`Locating all references of repo ${repoName}`);
    const refsResult = await repo.tags();
    const tagRefs = refsResult.all;
    this.logger.debug(`Located ${tagRefs.length} tags. Looking for tag ${tag}`);
    const filteredTags = tagRefs.filter((currentTag) => {
      return currentTag.includes(tag);
    });
    this.logger.debug(`Located ${filteredTags.length} matching tag(s)`);
    if (filteredTags.length > 1) {
      this.logger.debug(`Too many matching tags`);
      throw new Error(`Too many matching tags for tag ${tag} - [${filteredTags.join(`, `)}]`);
    }
    const tagRef = filteredTags[0];
    if (!tagRef) {
      this.logger.debug(`No matching tags`);
      throw new Error(`Failed to locate tag ${tag}`);
    }
    this.logger.debug(`Located matching tag ${tagRef.toString()}`);
    return tagRef;
  }

  public async openRepo({ path }: IOpenRepoOptions): Promise<SimpleGit> {
    this.logger.info(`Opening existing repo in ${path}`);
    const repo = this.git(path);
    this.logger.success(`Opened repo`);
    return repo;
  }
}
