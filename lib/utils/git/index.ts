import {getRepoDirName} from './helpers/getRepoDirName';
import * as path from 'path';
import * as fs from 'fs';
import {openRepo} from './helpers/openRepo';
import {cloneRepo} from './helpers/cloneRepo';
import {locateTag} from './helpers/locateTag';
import {checkoutReference} from './helpers/checkoutReference';
import {locateCommit} from './helpers/locateCommit';
import {checkoutCommit} from './helpers/checkoutCommit';

export interface ICheckoutOptions {
    url: string;
    baseDir: string;
    tag: string;
    commitSha?: string; // githead property
}

export const checkout = async ({url, baseDir, tag, commitSha}: ICheckoutOptions): Promise<string> => {
    const dirName = await getRepoDirName({url});
    const fullDir = path.join(baseDir, dirName);
    let exists: boolean;
    try {
        await fs.promises.stat(fullDir);
        exists = true;
    } catch (e) {
        exists = false;
    }
    const repo = exists ? await openRepo({
        path: fullDir,
    }) : await cloneRepo({
        url,
        dir: fullDir,
    });
    if (commitSha) {
        const commit = await locateCommit({repo, commitSha});
        await checkoutCommit({
            repo,
            commit,
        });
    } else {
        const reference = await locateTag({repo, tag});
        await checkoutReference({
            repo,
            reference,
        });
    }

    return fullDir;
};
