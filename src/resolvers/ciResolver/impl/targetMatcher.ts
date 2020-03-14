import {ITargetMatcher, ITargetMatcherOptions} from '../interfaces/targetMatcher';
import {injectable} from 'inversify';

@injectable()
export class TargetMatcher extends ITargetMatcher {
    public async match({targetNode, candidates}: ITargetMatcherOptions): Promise<boolean> {
        const dotedTargetVersions = `${targetNode}.`;
        const relevantVersions = candidates.filter((candidate) => {
            return candidate === targetNode || candidate.startsWith(dotedTargetVersions);
        });
        return relevantVersions.length > 0;
    }
}
