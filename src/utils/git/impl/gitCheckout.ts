import * as path from 'path';
import * as fs from 'fs';
import { injectable } from 'inversify';
import { ICheckoutOptions, IGitCheckout } from '../interfaces/gitCheckout';
import { getRepoDirName } from './getRepoDirName';
import { Git } from './git';

@injectable()
export class GitCheckout extends IGitCheckout {
  constructor(private git: Git) {
    super();
  }

  public async checkoutRepo({ url, baseDir, tag, commitSha }: ICheckoutOptions): Promise<string> {
    const dirName = await getRepoDirName({ url });
    const fullDir = path.join(baseDir, dirName);
    let exists: boolean;
    try {
      await fs.promises.stat(fullDir);
      exists = true;
    } catch (e) {
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
      await this.git.checkoutCommit({
        repo,
        commitSha,
      });
    } else {
      const reference = await this.git.locateTag({ repo, tag });
      await this.git.checkoutCommit({
        repo,
        commitSha: reference,
      });
    }
    return fullDir;
  }
}
