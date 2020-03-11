import {Repository} from 'nodegit';

export interface IOpenRepoOptions {
    path: string;
}

export const openRepo = async ({path}: IOpenRepoOptions): Promise<Repository> => {
    return await Repository.open(path);
};
