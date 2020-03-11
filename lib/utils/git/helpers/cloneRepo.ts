import {Clone} from 'nodegit';
import {Repository} from 'nodegit/repository';

export interface CloneRepoOptions {
    url: string;
    dir: string;
}

export const cloneRepo = async ({url, dir}: CloneRepoOptions): Promise<Repository> => {
    return await Clone.clone(url, dir);
};
