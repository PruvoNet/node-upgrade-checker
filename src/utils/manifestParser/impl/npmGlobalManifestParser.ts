import { injectable } from 'inversify';
import { ILoggerFactory } from '../../logger';
import { ILogger } from '../../logger/interfaces/ILogger';
import { INpmGlobalManifestParser, INpmGlobalManifestParserOptions } from '../interfaces/INpmGlobalManifestParser';
import { DependencyType, IDependency, IPackageData } from '../types';
import { dependencyTypeHandler } from './dependencyTypeHandler';
import * as _ from 'lodash';

@injectable()
export class NpmGlobalManifestParser extends INpmGlobalManifestParser {
  private readonly logger: ILogger;

  constructor(loggerFactory: ILoggerFactory) {
    super();
    this.logger = loggerFactory.getLogger(`Npm Global Manifest Parser`);
  }

  public async parse({ manifest, predicate }: INpmGlobalManifestParserOptions): Promise<IPackageData> {
    this.logger.info(`Reading npm global manifest information`);
    const deps = _.mapValues(manifest.dependencies, (val) => val.version);
    const global = dependencyTypeHandler({
      predicate,
      logger: this.logger,
      type: DependencyType.GLOBAL,
      included: true,
      dependencies: deps,
    });
    const dependencies = new Set<IDependency>([...global]);
    this.logger.info(`Going to check ${dependencies.size} dependencies`);
    return {
      dependencies,
    };
  }
}
