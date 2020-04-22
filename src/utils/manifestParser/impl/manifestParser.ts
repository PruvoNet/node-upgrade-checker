import { injectable } from 'inversify';
import { ILoggerFactory } from '../../logger';
import { ILogger } from '../../logger/interfaces/ILogger';
import { IManifestParser, IManifestParserOptions } from '../interfaces/IManifestParser';
import { DependencyType, IDependency, IPackageData } from '../types';
import { dependencyTypeHandler } from './dependencyTypeHandler';

@injectable()
export class ManifestParser extends IManifestParser {
  private readonly logger: ILogger;

  constructor(loggerFactory: ILoggerFactory) {
    super();
    this.logger = loggerFactory.getLogger(`Manifest Parser`);
  }

  public async parse({ manifest, include, predicate }: IManifestParserOptions): Promise<IPackageData> {
    this.logger.info(`Reading manifest information`);
    const options = {
      predicate,
      logger: this.logger,
    };
    const dev = dependencyTypeHandler({
      ...options,
      type: DependencyType.DEV,
      included: include.dev,
      dependencies: manifest.devDependencies,
    });
    const prod = dependencyTypeHandler({
      ...options,
      type: DependencyType.PROD,
      included: include.prod,
      dependencies: manifest.dependencies,
    });
    const peer = dependencyTypeHandler({
      ...options,
      type: DependencyType.PEER,
      included: include.peer,
      dependencies: manifest.peerDependencies,
    });
    const optional = dependencyTypeHandler({
      ...options,
      type: DependencyType.OPTIONAL,
      included: include.optional,
      dependencies: manifest.optionalDependencies,
    });
    const dependencies = new Set<IDependency>([...dev, ...prod, ...peer, ...optional]);
    this.logger.info(`Going to check ${dependencies.size} dependencies`);
    return {
      dependencies,
    };
  }
}
