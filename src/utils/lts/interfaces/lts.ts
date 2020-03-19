import { injectable } from 'inversify';
import { Moment } from 'moment';

export interface ILtsOptions {
  date: Moment;
}

@injectable()
export abstract class ILts {
  public abstract async resolveLtsVersion(options: ILtsOptions): Promise<string[]>;
}
