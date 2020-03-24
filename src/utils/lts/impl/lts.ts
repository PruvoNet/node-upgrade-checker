import { inject, injectable } from 'inversify';
import { ILts, ILtsOptions } from '../interfaces/ILts';
import { Moment } from 'moment';
import moment = require('moment');
import { memoize } from '../../memoize/memoize';
import { Axios, TYPES } from '../../../container/nodeModulesContainer';
import { ILoggerFactory } from '../../logger';
import { ILogger } from '../../logger/interfaces/logger';

const NODE_RELEASE_FILE = `https://raw.githubusercontent.com/nodejs/Release/master/schedule.json`;
const dateFormat = `YYYY-MM-DD`;

interface IRemoteNodeVersion {
  start: string;
  end: string;
  lts?: string;
}

type RemoteNodeVersions = Record<string, IRemoteNodeVersion>;

interface INodeVersion {
  from: Moment;
  to: Moment;
  version: string;
}

@injectable()
export class Lts extends ILts {
  private readonly logger: ILogger;
  constructor(@inject(TYPES.Axios) private readonly axios: Axios, loggerFactory: ILoggerFactory) {
    super();
    this.logger = loggerFactory.getLogger(`LTS`);
  }

  async resolveLtsVersion({ date }: ILtsOptions): Promise<string[]> {
    this.logger.debug(`Resolving LTS versions from ${date.toJSON()}`);
    const versions = await this.getAllVersions();
    const relevantVersions = versions
      .filter((lts: INodeVersion) => lts.from.isSameOrBefore(date) && lts.to.isSameOrAfter(date))
      .map((lts: INodeVersion) => lts.version);
    this.logger.debug(`Resolved LTS versions from ${date.toJSON()} to ${JSON.stringify(relevantVersions)}`);
    return relevantVersions;
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
            version: version.substr(1),
          };
        });
    } catch (err) {
      this.logger.error(`Failed to fetch node release versions`, err);
      throw new Error(`Failed to fetch node release versions`);
    }
  }
}
