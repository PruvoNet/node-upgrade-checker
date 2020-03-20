import { ITargetMatcher, ITargetMatcherOptions } from '../interfaces/targetMatcher';
import { injectable } from 'inversify';
import { ILts } from '../../../utils/lts';
import { LTS_VERSION } from '..';
// eslint-disable-next-line @typescript-eslint/quotes
import semver = require('semver');

const coerce = (version: string): string => {
  const coereced = semver.coerce(semver.coerce(version)?.major?.toFixed(0) || version);
  if (coereced) {
    return coereced.format();
  }
  return version;
};

@injectable()
export class TargetMatcher extends ITargetMatcher {
  constructor(private lts: ILts) {
    super();
  }

  public async match({ targetNode, candidates, packageReleaseDate }: ITargetMatcherOptions): Promise<boolean> {
    const validTarget = coerce(targetNode);
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
    const matchingCandidates = resolvedCandidates.filter((candidate) => {
      const validCandidate = coerce(candidate);
      return semver.eq(validTarget, validCandidate);
    });
    return matchingCandidates.length > 0;
  }
}
