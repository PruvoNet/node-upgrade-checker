import { injectable } from 'inversify';
import { IResolverResult } from '../../types';
import { IEnginesResolver, IEnginesResolverOptions } from '../interfaces/IEnginesResolver';
import semver = require('semver');
import SemVer = require('semver/classes/semver');
import Comparator = require('semver/classes/comparator');

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

const strictSatisfiesRange = (target: string, range: string): boolean => {
  const rangeObj = new semver.Range(range, semverOptions);
  const revisedComparatorRange: (readonly Comparator[])[] = [];
  for (const comparatorRange of rangeObj.set) {
    let hasUpperBound = false;
    let hasLowerBound = false;
    for (const comparator of comparatorRange) {
      if (comparator.operator === `<` || comparator.operator === `<=`) {
        hasUpperBound = true;
      } else if (comparator.operator === `>` || comparator.operator === `>=`) {
        hasLowerBound = true;
      }
    }
    if ((hasLowerBound && hasUpperBound) || (!hasLowerBound && !hasUpperBound)) {
      revisedComparatorRange.push(comparatorRange);
    }
  }
  rangeObj.set = revisedComparatorRange;
  const revisedRange = new semver.Range(rangeObj.format(), semverOptions);
  return semver.satisfies(target, revisedRange);
};

const resolverName = `engines field`;

@injectable()
export class EnginesResolver extends IEnginesResolver {
  constructor() {
    super();
  }

  public async resolve({ engines, targetNode }: IEnginesResolverOptions): Promise<IResolverResult> {
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
    const isMatch = strictSatisfiesRange(validTarget, validRange);
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
