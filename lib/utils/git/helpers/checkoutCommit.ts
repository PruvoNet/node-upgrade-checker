import {Checkout, Commit, Repository, Reset} from 'nodegit';

export interface ICheckoutCommitOptions {
    repo: Repository;
    commit: Commit;
}

export const checkoutCommit = async ({repo, commit}: ICheckoutCommitOptions): Promise<void> => {
    await Reset.reset(repo, commit, Reset.TYPE.HARD, {checkoutStrategy: Checkout.STRATEGY.SAFE});
};
