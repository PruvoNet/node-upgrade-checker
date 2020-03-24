import { Moment } from 'moment';

export interface INodeVersionsLtsOptions {
  codename: string;
}

export interface INodeVersionsLatestOptions {
  date: Moment;
}

export abstract class INodeVersions {
  public abstract async resolveLtsVersion(options: INodeVersionsLtsOptions): Promise<string | undefined>;
  public abstract async resolveLatestLtsVersion(options: INodeVersionsLatestOptions): Promise<string | undefined>;
  public abstract async resolveStableVersion(options: INodeVersionsLatestOptions): Promise<string | undefined>;
}
