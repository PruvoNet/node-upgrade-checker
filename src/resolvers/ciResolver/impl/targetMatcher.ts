import { IGetLtsVersionPlaceholderOptions, ITargetMatcher, ITargetMatcherOptions } from '../interfaces/ITargetMatcher';
import { injectable } from 'inversify';
import { INodeVersions } from '../../../utils/nodeVersions';
import semver = require('semver');
import { ILoggerFactory } from '../../../utils/logger';
import { ILogger } from '../../../utils/logger/interfaces/ILogger';

const coerce = (version: string): string | undefined => {
  const coercedAll = semver.coerce(version);
  if (!coercedAll) {
    return undefined;
  }
  const majorStr = coercedAll.major.toFixed(0);
  const coerced = semver.coerce(majorStr);
  return coerced!.format();
};

const STABLE_PLACEHOLDER = `__STABLE__`;
const LATEST_LTS_PLACEHOLDER = `__LTS*__`;
const LTS_PLACEHOLDER = `__LTS__`;
const ltsPlaceholderRegex = new RegExp(`${LTS_PLACEHOLDER}(.+)`, `i`);

@injectable()
export class TargetMatcher extends ITargetMatcher {
  private readonly logger: ILogger;
  constructor(private readonly nodeVersions: INodeVersions, loggerFactory: ILoggerFactory) {
    super();
    this.logger = loggerFactory.getLogger(`Target Matcher`);
  }

  public getStableVersionPlaceholder(): string {
    return STABLE_PLACEHOLDER;
  }

  public getLatestLtsVersionPlaceholder(): string {
    return LATEST_LTS_PLACEHOLDER;
  }

  public getLtsVersionPlaceholder({ codename }: IGetLtsVersionPlaceholderOptions): string {
    return `${LTS_PLACEHOLDER}${codename}`;
  }

  public async match({ targetNode, candidates, packageReleaseDate }: ITargetMatcherOptions): Promise<boolean> {
    this.logger.debug(`Trying to match to ${targetNode}`);
    const validTarget = coerce(targetNode);
    if (!validTarget) {
      this.logger.debug(`Failed to coerce target ${targetNode}`);
      throw new TypeError(`Node target version ${targetNode} is not valid`);
    }
    this.logger.debug(`Coerced target is ${validTarget}`);
    const resolvedCandidates: string[] = [];
    for (const candidate of candidates) {
      if (candidate === STABLE_PLACEHOLDER) {
        this.logger.debug(`Resolving stable version in ${packageReleaseDate.toJSON()}`);
        const resolved = await this.nodeVersions.resolveStableVersion({
          date: packageReleaseDate,
        });
        if (resolved) {
          resolvedCandidates.push(resolved);
        }
      }
      if (candidate === LATEST_LTS_PLACEHOLDER) {
        this.logger.debug(`Resolving latest lts version in ${packageReleaseDate.toJSON()}`);
        const resolved = await this.nodeVersions.resolveLatestLtsVersion({
          date: packageReleaseDate,
        });
        if (resolved) {
          resolvedCandidates.push(resolved);
        }
      } else {
        const codename = ltsPlaceholderRegex.exec(candidate)?.[1];
        if (codename) {
          this.logger.debug(`Resolving LTS version of ${codename}`);
          const resolved = await this.nodeVersions.resolveLtsVersion({
            codename,
          });
          if (resolved) {
            resolvedCandidates.push(resolved);
          }
        } else {
          resolvedCandidates.push(candidate);
        }
      }
    }
    const matchingCandidates = resolvedCandidates.filter((candidate) => {
      const validCandidate = coerce(candidate);
      this.logger.debug(`Coerced version of candidate ${candidate} is ${validCandidate}`);
      return validCandidate && semver.eq(validTarget, validCandidate);
    });
    this.logger.debug(`Found ${matchingCandidates.length} match(es)`);
    return matchingCandidates.length > 0;
  }
}
