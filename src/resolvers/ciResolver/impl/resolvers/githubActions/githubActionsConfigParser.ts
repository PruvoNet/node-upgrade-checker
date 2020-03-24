import { ISpecificCIResolverResponse } from '../../../interfaces/ISpecificCIResolver';
import { injectable } from 'inversify';
import { ILoggerFactory } from '../../../../../utils/logger';
import { ILogger } from '../../../../../utils/logger/interfaces/ILogger';
import { INode, keySorter, NodeSorter, objectIterator } from '../../../../../utils/objectIterator/objectIterator';
import { is, isArrayOfObjects, isNumber, isString } from 'ts-type-guards';
import { INvmHandler } from '../../../interfaces/INvmHandler';

const envRegex = /\${{\s*(?:env|matrix|secrets)\.([^\s]+)\s*}}/i;
const nodeEnvReplaceRegex = /\${{\s*(?:env|matrix|secrets)\.([^\s]+)\s*}}/i;

type Scalar = string | number;
type Matrix = Record<string, string[]>;

const toString = (value: Scalar): string => String(value);

const nodeVersionCommandParser = (matrix: Matrix) => (version: Scalar): string[] => {
  version = String(version);
  const matrixKey = envRegex.exec(version)?.[1];
  if (matrixKey) {
    const matrixVersions = matrix[matrixKey.trim()];
    return matrixVersions || [];
  } else {
    return [version];
  }
};

const sorter: NodeSorter = (a: INode, b: INode) => {
  if (a.parent.isNonRootNode && a.parent.key === `matrix`) {
    if (a.key === `include`) {
      return 1;
    } else if (b.key === `include`) {
      return -1;
    }
  }
  return keySorter(a, b);
};

const isStringOrNumber = (x: any): x is string | number => {
  return isString(x) || isNumber(x);
};

const isStringOrNumberArray = (x: any): x is Scalar[] => {
  return is(Array)(x) && x.every(isStringOrNumber);
};

export interface IGithubActionsConfigParserOptions {
  config: Record<string, any>;
}

@injectable()
export class GithubActionsConfigParser {
  private readonly logger: ILogger;

  constructor(private readonly nvmHandler: INvmHandler, loggerFactory: ILoggerFactory) {
    this.logger = loggerFactory.getLogger(`Github Actions Config Parser`);
  }

  public async parse({ config }: IGithubActionsConfigParserOptions): Promise<ISpecificCIResolverResponse> {
    this.logger.debug(`Parsing Github Actions configuration`);
    const rawVersions: Scalar[] = [];
    const matrix: Matrix = {};
    const nvmCommands: string[] = [];
    const it = objectIterator(config, sorter);
    let iteration = it.next();
    while (!iteration.done) {
      const { value: node } = iteration;
      const { value, parent, key, isLeaf } = node;
      let skip = false;
      if (isLeaf && parent.isNonRootNode && parent.key === `env` && isStringOrNumber(value)) {
        if (matrix[key]) {
          matrix[key].push(String(value));
        } else {
          matrix[key] = [String(value)];
        }
        skip = true;
      } else if (
        parent.isNonRootNode &&
        parent.key === `matrix` &&
        parent.parent.isNonRootNode &&
        parent.parent.key === `strategy` &&
        isStringOrNumberArray(value)
      ) {
        if (matrix[key]) {
          matrix[key].push(...value.map(toString));
        } else {
          matrix[key] = value.map(toString);
        }
        skip = true;
      } else if (
        parent.isNonRootNode &&
        parent.key === `matrix` &&
        parent.parent.isNonRootNode &&
        parent.parent.key === `strategy` &&
        key === `include` &&
        isArrayOfObjects(value)
      ) {
        for (const element of value) {
          for (const [currentKey, currentValue] of Object.entries(element)) {
            if (matrix[currentKey]) {
              matrix[currentKey].push(String(currentValue));
            } else {
              matrix[currentKey] = [String(currentValue)];
            }
          }
        }
        skip = true;
      } else if (
        isLeaf &&
        key === `node-version` &&
        parent.isNonRootNode &&
        parent.key === `with` &&
        isStringOrNumber(value)
      ) {
        rawVersions.push(value);
        skip = true;
      } else if (isLeaf && key === `run` && isString(value)) {
        const command = value.replace(nodeEnvReplaceRegex, `\${$1}`);
        if (this.nvmHandler.isNvmCommand(command)) {
          this.logger.debug(`Found nvm command - ${command}`);
          nvmCommands.push(command);
        }
        skip = true;
      }
      iteration = it.next(skip);
    }
    const versions = new Set(rawVersions.flatMap(nodeVersionCommandParser(matrix)));
    nvmCommands.forEach((command) => {
      this.nodeVersionCommandParser(command, matrix, versions);
    });
    this.logger.debug(`Finished parsing AppVeyor configuration, Found ${versions.size} version(s)`);
    return {
      nodeVersions: versions,
    };
  }

  private nodeVersionCommandParser(command: string, matrix: Matrix, versions: Set<string>): void {
    const foundVersions = this.nvmHandler.getNvmVersionsFromMatrix(command, matrix);
    for (const version of foundVersions) {
      versions.add(version);
    }
  }
}
