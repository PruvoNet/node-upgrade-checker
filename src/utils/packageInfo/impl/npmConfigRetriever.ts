import { inject, injectable } from 'inversify';
import { LibNpmConfig, TYPES } from '../../../container/nodeModulesContainer';
import { ILoggerFactory, ILogger } from '../../logger';
import { INpmConfig, INpmConfigRetriever } from '../interfaces/INpmConfigRetriever';
import { isBoolean, isString } from 'ts-type-guards';

const coerceBoolean = (value: undefined | string | boolean): boolean => {
  if (value === undefined || value === null) {
    return false;
  }
  if (isBoolean(value)) {
    return value;
  }
  return value.toLowerCase() === `true`;
};

@injectable()
export class NpmConfigRetriever extends INpmConfigRetriever {
  private readonly logger: ILogger;

  constructor(@inject(TYPES.LibNpmConfig) private readonly libnpmconfig: LibNpmConfig, loggerFactory: ILoggerFactory) {
    super();
    this.logger = loggerFactory.getLogger(`Npm Config Retriever`);
  }

  async retrieve(): Promise<INpmConfig> {
    this.logger.info(`Reading npm config`);
    const result = this.libnpmconfig.read();
    const npmConfig: INpmConfig = {};
    result.forEach((value: any, key: string) => {
      if (isString(value) && key.indexOf(`:`) > 0) {
        npmConfig[key] = value;
      }
    });
    npmConfig[`always-auth`] = coerceBoolean(result[`always-auth`]);
    npmConfig.strictSSL = coerceBoolean(result[`strict-ssl`]);
    npmConfig.alwaysAuth = coerceBoolean(result.alwaysAuth);
    npmConfig.registry = result.registry;
    npmConfig.username = result.username;
    npmConfig.password = result.password;
    npmConfig.token = result.token;
    // eslint-disable-next-line no-underscore-dangle
    npmConfig._authToken = result._authToken;
    // eslint-disable-next-line no-underscore-dangle
    npmConfig._auth = result._auth;
    npmConfig.email = result.email;
    return npmConfig;
  }
}
