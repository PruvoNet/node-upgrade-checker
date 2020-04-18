export interface ICheckoutOptions {
  url: string;
  baseDir: string;
  tag: string;
  commitSha?: string;
}

export interface ICheckoutResult {
  commitSha: string;
  repoPath: string;
}

export abstract class IGitCheckout {
  public abstract async checkoutRepo(options: ICheckoutOptions): Promise<ICheckoutResult>;
}
