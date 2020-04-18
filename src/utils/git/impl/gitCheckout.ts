import * as path from 'path';
import { inject, injectable } from 'inversify';
import { ICheckoutOptions, ICheckoutResult, IGitCheckout } from '../interfaces/IGitCheckout';
import { getRepoDirName } from './getRepoDirName';
import { Git } from './git';
import { FS, TYPES } from '../../../container/nodeModulesContainer';
import { ILoggerFactory } from '../../logger';
import { ILogger } from '../../logger/interfaces/ILogger';

@injectable()
export class GitCheckout extends IGitCheckout {
  private logger: ILogger;
  constructor(private git: Git, @inject(TYPES.FS) private fs: FS, loggerFactory: ILoggerFactory) {
    super();
    this.logger = loggerFactory.getLogger(`GitCheckout`);
  }

  public async checkoutRepo({ url, baseDir, tag, commitSha }: ICheckoutOptions): Promise<ICheckoutResult> {
    const dirName = await getRepoDirName({ url });
    const fullDir = path.join(baseDir, dirName);
    this.logger.info(`Cloning repo ${url} to ${fullDir}`);
    let exists: boolean;
    try {
      await this.fs.promises.stat(fullDir);
      this.logger.debug(`Repo already exists locally`);
      exists = true;
    } catch (e) {
      this.logger.debug(`Repo doesn't exist locally, will create directory ${fullDir}`);
      await this.fs.promises.mkdir(fullDir);
      exists = false;
    }
    const repo = exists
      ? await this.git.openRepo({
          path: fullDir,
        })
      : await this.git.cloneRepo({
          url,
          dir: fullDir,
        });
    if (commitSha) {
      this.logger.debug(`Checking out provided commit ${commitSha}`);
      await this.git.checkoutCommit({
        repo,
        commitSha,
      });
    } else {
      this.logger.debug(`Looking for commit of tag ${tag}`);
      commitSha = await this.git.locateTag({ repo, tag });
      this.logger.debug(`Checking out found commit ${commitSha} for tag ${tag}`);
      await this.git.checkoutCommit({
        repo,
        commitSha,
      });
    }
    this.logger.success(`Checking out repo ${dirName}`);
    return {
      repoPath: fullDir,
      commitSha,
    };
  }
}
