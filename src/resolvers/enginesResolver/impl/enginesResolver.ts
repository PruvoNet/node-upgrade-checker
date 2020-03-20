import { injectable } from 'inversify';
import { IResolverResult } from '../../types';
import { IEnginesResolver, IEnginesResolverOptions } from '../interfaces/enginesResolver';
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
    const validRange = semver.validRange(engines);
    if (!validRange) {
      throw new TypeError(`Engines range ${engines} is not valid`);
    }
    const isMatch = semver.satisfies(validTarget, validRange);
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
