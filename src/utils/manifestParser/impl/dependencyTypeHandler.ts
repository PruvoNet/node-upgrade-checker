import { DependencyType, IDependency } from '../types';
import { IPredicate } from '../../predicateBuilder/predicateBuilder';
import { ILogger } from '../../logger/interfaces/ILogger';

interface DependencyTypeHandlerOptions {
  predicate: IPredicate;
  included: boolean;
  dependencies: undefined | Record<string, string>;
  type: DependencyType;
  logger: ILogger;
}

export const dependencyTypeHandler = ({
  included,
  dependencies,
  type,
  predicate,
  logger,
}: DependencyTypeHandlerOptions): Set<IDependency> => {
  const results = new Set<IDependency>();
  if (included) {
    if (dependencies) {
      let count = 0;
      for (const [name, semver] of Object.entries(dependencies)) {
        if (predicate(name)) {
          count++;
          results.add({
            name,
            semver,
            dependencyType: type,
          });
        } else {
          logger.info(`Skipping ${name}`);
        }
      }
      logger.info(`Found ${count} ${type} dependencies`);
    } else {
      logger.info(`No ${type} dependencies defined`);
    }
  } else {
    logger.info(`Skipping ${type} dependencies`);
  }
  return results;
};
