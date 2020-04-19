export interface ICheckoutOptions {
  url: string;
  baseDir: string;
  tag: string;
  commitSha?: string;
}

export abstract class IGitCheckout {
  public abstract async checkoutRepo(options: ICheckoutOptions): Promise<string>;
}
