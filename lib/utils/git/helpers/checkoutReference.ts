import {Reference, Repository} from 'nodegit';

export interface ICheckoutReferenceOptions {
    repo: Repository;
    reference: Reference;
}

export const checkoutReference = async ({repo, reference}: ICheckoutReferenceOptions): Promise<void> => {
    await repo.checkoutRef(reference);
};
