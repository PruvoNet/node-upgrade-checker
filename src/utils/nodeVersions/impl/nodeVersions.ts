import { inject, injectable } from 'inversify';
import { INodeVersions, INodeVersionsLtsOptions, INodeVersionsLatestOptions } from '../interfaces/INodeVersions';
import { Moment } from 'moment';
import moment = require('moment');
import { memoize } from '../../memoize/memoize';
import { Axios, TYPES } from '../../../container/nodeModulesContainer';
import { ILoggerFactory } from '../../logger';
import { ILogger } from '../../logger/interfaces/ILogger';
import { O } from 'ts-toolbelt';

const NODE_RELEASE_FILE = `https://raw.githubusercontent.com/nodejs/Release/master/schedule.json`;
const dateFormat = `YYYY-MM-DD`;

interface IRemoteNodeVersion {
  start: string;
  end: string;
  codename?: string;
  lts?: string;
}

type RemoteNodeVersions = Record<string, IRemoteNodeVersion>;

interface INodeVersion {
  from: Moment;
  ltsFrom: Moment;
  to: Moment;
  version: string;
  codename: string;
}

const dateSorter = (key: O.SelectKeys<INodeVersion, Moment>) => (a: INodeVersion, b: INodeVersion): number => {
  return a[key].valueOf() - b[key].valueOf();
};

@injectable()
export class NodeVersions extends INodeVersions {
  private readonly logger: ILogger;
  constructor(@inject(TYPES.Axios) private readonly axios: Axios, loggerFactory: ILoggerFactory) {
    super();
    this.logger = loggerFactory.getLogger(`Node Versions`);
  }

  @memoize(({ codename }: INodeVersionsLtsOptions): string => codename.toLowerCase())
  public async resolveLtsVersion({ codename }: INodeVersionsLtsOptions): Promise<string | undefined> {
    codename = codename.toLowerCase();
    this.logger.debug(`Resolving LTS version of ${codename}`);
    const versions = await this.getAllVersions();
    const relevantVersions = versions
      .filter((nodeVersion: INodeVersion) => nodeVersion.codename === codename)
      .map((nodeVersion: INodeVersion) => nodeVersion.version);
    const lts = relevantVersions[0];
    if (!lts) {
      this.logger.error(`Failed to resolve LTS version of ${codename}`);
      return;
    }
    this.logger.debug(`Resolved LTS version of ${codename} to ${lts}`);
    return lts;
  }

  @memoize(({ date }: INodeVersionsLatestOptions): string => date.toJSON())
  public async resolveLatestLtsVersion({ date }: INodeVersionsLatestOptions): Promise<string | undefined> {
    this.logger.debug(`Resolving latest lts version in ${date.toJSON()}`);
    const versions = await this.getAllVersions();
    const relevantVersions = versions
      .filter(
        (nodeVersion: INodeVersion) => nodeVersion.ltsFrom.isSameOrBefore(date) && nodeVersion.to.isSameOrAfter(date)
      )
      .sort(dateSorter(`ltsFrom`))
      .map((nodeVersion: INodeVersion) => nodeVersion.version);
    const latest = relevantVersions[relevantVersions.length - 1];
    if (!latest) {
      this.logger.error(`Failed to resolve latest lts version in ${date.toJSON()}`);
      return;
    }
    this.logger.debug(`Resolved latest lts version in ${date.toJSON()} to ${latest}`);
    return latest;
  }

  @memoize(({ date }: INodeVersionsLatestOptions): string => date.toJSON())
  public async resolveStableVersion({ date }: INodeVersionsLatestOptions): Promise<string | undefined> {
    this.logger.debug(`Resolving stable version in ${date.toJSON()}`);
    const versions = await this.getAllVersions();
    const relevantVersions = versions
      .filter(
        (nodeVersion: INodeVersion) => nodeVersion.from.isSameOrBefore(date) && nodeVersion.to.isSameOrAfter(date)
      )
      .sort(dateSorter(`from`))
      .map((nodeVersion: INodeVersion) => nodeVersion.version);
    const latest = relevantVersions[relevantVersions.length - 1];
    if (!latest) {
      this.logger.error(`Failed to resolve stable version in ${date.toJSON()}`);
      return;
    }
    this.logger.debug(`Resolved stable version in ${date.toJSON()} to ${latest}`);
    return latest;
  }

  @memoize()
  private async getAllVersions(): Promise<INodeVersion[]> {
    this.logger.debug(`Fetching all node release versions`);
    try {
      const response = await this.axios.get<RemoteNodeVersions>(NODE_RELEASE_FILE);
      this.logger.debug(`Parsing versions result object`);
      return Object.entries(response.data)
        .filter(([, data]) => data.lts)
        .map(([version, data]) => {
          return {
            from: moment(data.start, dateFormat),
            to: moment(data.end, dateFormat),
            ltsFrom: moment(data.lts, dateFormat),
            version: version.substr(1),
            codename: (data.codename || ``).toLowerCase(),
          };
        });
    } catch (err) {
      this.logger.error(`Failed to fetch node release versions`, err);
      throw new Error(`Failed to fetch node release versions`);
    }
  }
}
