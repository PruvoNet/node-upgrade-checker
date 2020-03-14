import {injectable} from 'inversify';

export interface ITargetMatcherOptions {
    targetNode: string;
    candidates: string[];
}

@injectable()
export abstract class ITargetMatcher {
    public abstract async match(options: ITargetMatcherOptions): Promise<boolean>;
}
