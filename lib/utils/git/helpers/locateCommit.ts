import {Repository, Commit, Oid} from 'nodegit';

export interface ILocateTagOptions {
    repo: Repository;
    commitSha: string;
}

export const locateCommit = async ({repo, commitSha}: ILocateTagOptions): Promise<Commit> => {
    try {
        const id = Oid.fromString(commitSha);
        return await repo.getCommit(id);
    } catch (e) {
        throw new Error(`Failed to locate commit ${commitSha}`);
    }
};
