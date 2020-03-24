import { injectable } from 'inversify';

export interface ICheckoutOptions {
  url: string;
  baseDir: string;
  tag: string;
  commitSha?: string;
}

@injectable()
export abstract class IGitCheckout {
  public abstract async checkoutRepo(options: ICheckoutOptions): Promise<string>;
}
