import { ITargetMatcher, ITargetMatcherOptions } from '../interfaces/targetMatcher';
import { injectable } from 'inversify';
import { ILts } from '../../../utils/lts';
import { LTS_VERSION } from '..';

@injectable()
export class TargetMatcher extends ITargetMatcher {
  constructor(private lts: ILts) {
    super();
  }

  public async match({ targetNode, candidates, packageReleaseDate }: ITargetMatcherOptions): Promise<boolean> {
    const resolvedCandidates: string[] = [];
    for (const candidate of candidates) {
      if (candidate === LTS_VERSION) {
        const resolved = await this.lts.resolveLtsVersion({
          date: packageReleaseDate,
        });
        Array.prototype.push.apply(resolvedCandidates, resolved);
      } else {
        resolvedCandidates.push(candidate);
      }
    }
    const dotedTargetVersions = `${targetNode}.`;
    for (const candidate of resolvedCandidates) {
      if (candidate === targetNode) {
        return true;
      }
      if (candidate.startsWith(dotedTargetVersions)) {
        return true;
      }
    }
    return false;
  }
}
