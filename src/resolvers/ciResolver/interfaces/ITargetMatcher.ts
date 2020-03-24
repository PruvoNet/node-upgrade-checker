import { Moment } from 'moment';

export interface ITargetMatcherOptions {
  targetNode: string;
  candidates: Set<string>;
  packageReleaseDate: Moment;
}

export interface IGetLtsVersionPlaceholderOptions {
  codename: string;
}

export abstract class ITargetMatcher {
  public abstract getStableVersionPlaceholder(): string;
  public abstract getLatestLtsVersionPlaceholder(): string;
  public abstract getLtsVersionPlaceholder(options: IGetLtsVersionPlaceholderOptions): string;
  public abstract async match(options: ITargetMatcherOptions): Promise<boolean>;
}
