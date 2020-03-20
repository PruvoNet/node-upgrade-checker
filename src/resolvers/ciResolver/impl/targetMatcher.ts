import { ITargetMatcher, ITargetMatcherOptions } from '../interfaces/targetMatcher';
import { injectable } from 'inversify';
import { ILts } from '../../../utils/lts';
import { LTS_VERSION } from '..';
// eslint-disable-next-line @typescript-eslint/quotes
import semver = require('semver');

const semverOptions = {
  loose: true,
};

const coerce = (version: string): string | undefined => {
  const coercedAll = semver.coerce(version, semverOptions);
  if (!coercedAll) {
    return undefined;
  }
  const majorStr = coercedAll.major.toFixed(0);
  const coerced = semver.coerce(majorStr, semverOptions);
  return coerced!.format();
};

@injectable()
export class TargetMatcher extends ITargetMatcher {
  constructor(private lts: ILts) {
    super();
  }

  public async match({ targetNode, candidates, packageReleaseDate }: ITargetMatcherOptions): Promise<boolean> {
    const validTarget = coerce(targetNode);
    if (!validTarget) {
      throw new TypeError(`Node target version ${targetNode} is not valid`);
    }
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
      return validCandidate && semver.eq(validTarget, validCandidate);
    });
    return matchingCandidates.length > 0;
  }
}
