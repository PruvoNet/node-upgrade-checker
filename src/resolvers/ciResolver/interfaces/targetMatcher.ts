import { injectable } from 'inversify';
import { Moment } from 'moment';

export interface ITargetMatcherOptions {
  targetNode: string;
  candidates: string[];
  packageReleaseDate: Moment;
}

@injectable()
export abstract class ITargetMatcher {
  public abstract async match(options: ITargetMatcherOptions): Promise<boolean>;
}
