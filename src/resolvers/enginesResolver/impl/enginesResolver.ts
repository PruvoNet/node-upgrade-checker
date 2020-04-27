import { injectable } from 'inversify';
import { IResolverResult } from '../../types';
import { IEnginesResolver, IEnginesResolverOptions } from '../interfaces/IEnginesResolver';
import semver = require('semver');
import SemVer = require('semver/classes/semver');
import Comparator = require('semver/classes/comparator');
import { INodeVersions } from '../../../utils/nodeVersions';

const semverOptions = {
  loose: true,
};

const coerceSemVer = (version: SemVer): SemVer => {
  const majorStr = version.major.toFixed(0);
  return semver.coerce(majorStr)!;
};

const coerce = (version: string): string | null => {
  const coercedAll = semver.coerce(version);
  if (!coercedAll) {
    return null;
  }
  const coerced = coerceSemVer(coercedAll);
  return coerced.format();
};

const strictSatisfiesRange = (target: string, range: string, upperBoundVersion: string | undefined): boolean => {
  const rangeObj = new semver.Range(range, semverOptions);
  const revisedComparatorRange: (readonly Comparator[])[] = [];
  for (const roComparatorRange of rangeObj.set) {
    const comparatorRange: Comparator[] = [];
    let hasUpperBound = false;
    let hasLowerBound = false;
    for (const comparator of roComparatorRange) {
      if (comparator.operator === `<` || comparator.operator === `<=`) {
        hasUpperBound = true;
        comparatorRange.push(comparator);
      } else if (comparator.operator === `>` || comparator.operator === `>=`) {
        hasLowerBound = true;
        const newRangeString = semver.validRange(`>=${comparator.semver.major.toFixed(0)}`, semverOptions);
        comparatorRange.push(new semver.Comparator(newRangeString, semverOptions));
      }
    }
    if (hasLowerBound && !hasUpperBound && upperBoundVersion) {
      const newRangeString = semver.validRange(`<=${upperBoundVersion}`, semverOptions);
      comparatorRange.push(new semver.Comparator(newRangeString, semverOptions));
      hasUpperBound = true;
    }
    if (hasLowerBound && hasUpperBound) {
      revisedComparatorRange.push(comparatorRange);
    } else if (!hasLowerBound && !hasUpperBound) {
      revisedComparatorRange.push(roComparatorRange);
    }
  }
  rangeObj.set = revisedComparatorRange;
  const revisedRange = new semver.Range(rangeObj.format(), semverOptions);
  return semver.satisfies(target, revisedRange);
};

const resolverName = `engines field`;

@injectable()
export class EnginesResolver extends IEnginesResolver {
  constructor(private readonly nodeVersions: INodeVersions) {
    super();
  }

  public async resolve({ engines, targetNode, releaseDate }: IEnginesResolverOptions): Promise<IResolverResult> {
    if (!engines) {
      return {
        isMatch: false,
      };
    }
    const validTarget = coerce(targetNode);
    if (!validTarget) {
      throw new TypeError(`Node target version ${targetNode} is not valid`);
    }
    const validRange = semver.validRange(engines, semverOptions);
    if (!validRange) {
      throw new TypeError(`Engines range ${engines} is not valid`);
    }
    const upperBound = releaseDate
      ? await this.nodeVersions.resolveStableVersion({
          date: releaseDate,
        })
      : undefined;
    const isMatch = strictSatisfiesRange(validTarget, validRange, upperBound);
    if (isMatch) {
      return {
        isMatch: true,
        resolverName,
      };
    }
    return {
      isMatch: false,
    };
  }
}
