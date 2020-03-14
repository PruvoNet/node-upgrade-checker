import {injectable} from 'inversify';

export interface ICheckoutOptions {
    url: string;
    baseDir: string;
    tag: string;
    commitSha?: string; // githead property
}

@injectable()
export abstract class IGitCheckout {
    abstract async checkoutRepo(options: ICheckoutOptions): Promise<string>;
}
