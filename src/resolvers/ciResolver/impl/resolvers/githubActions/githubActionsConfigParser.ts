import { ISpecificCIResolverResponse } from '../../../interfaces/ISpecificCIResolver';
import { injectable } from 'inversify';
import { ILoggerFactory } from '../../../../../utils/logger';
import { ILogger } from '../../../../../utils/logger/interfaces/ILogger';
import { INode, keySorter, NodeSorter, objectIterator } from '../../../../../utils/objectIterator/objectIterator';
import { is, isArrayOfObjects, isString } from 'ts-type-guards';
import { INvmHandler } from '../../../interfaces/INvmHandler';
import { isStringOrNumber } from '../../../../../utils/types/typeGuards';
import { StringOrNumber } from '../../../../../utils/types/types';

const envRegex = /\${{\s*(?:env|matrix|secrets)\.([^\s]+)\s*}}/i;
const nodeEnvReplaceRegex = /\${{\s*(?:env|matrix|secrets)\.([^\s]+)\s*}}/i;

type Matrix = Record<string, string[]>;

const toString = (value: StringOrNumber): string => String(value);

const nodeVersionCommandParser = (matrix: Matrix) => (version: StringOrNumber): string[] => {
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

const isStringOrNumberArray = (x: unknown): x is StringOrNumber[] => {
  return is(Array)(x) && x.every(isStringOrNumber);
};

export interface IGithubActionsConfigParserOptions {
  config: Record<string, unknown>;
}

const isEnvNode = (value: unknown, node: INode): value is StringOrNumber => {
  const { parent, isLeaf } = node;
  return isLeaf && parent.isNonRootNode && parent.key === `env` && isStringOrNumber(value);
};

const isMatrixNode = (value: unknown, node: INode): value is StringOrNumber[] => {
  const { parent } = node;
  return (
    parent.isNonRootNode &&
    parent.key === `matrix` &&
    parent.parent.isNonRootNode &&
    parent.parent.key === `strategy` &&
    isStringOrNumberArray(value)
  );
};

const isIncludeMatrixNode = (value: unknown, node: INode): value is object[] => {
  const { parent, key } = node;
  return (
    parent.isNonRootNode &&
    parent.key === `matrix` &&
    parent.parent.isNonRootNode &&
    parent.parent.key === `strategy` &&
    key === `include` &&
    isArrayOfObjects(value)
  );
};

const isNodeVersionNode = (value: unknown, node: INode): value is StringOrNumber => {
  const { parent, key, isLeaf } = node;
  return isLeaf && key === `node-version` && parent.isNonRootNode && parent.key === `with` && isStringOrNumber(value);
};

const isRunNode = (value: unknown, node: INode): value is string => {
  const { key, isLeaf } = node;
  return isLeaf && key === `run` && isString(value);
};

@injectable()
export class GithubActionsConfigParser {
  private readonly logger: ILogger;

  constructor(private readonly nvmHandler: INvmHandler, loggerFactory: ILoggerFactory) {
    this.logger = loggerFactory.getLogger(`Github Actions Config Parser`);
  }

  public async parse({ config }: IGithubActionsConfigParserOptions): Promise<ISpecificCIResolverResponse> {
    this.logger.debug(`Parsing Github Actions configuration`);
    const rawVersions: StringOrNumber[] = [];
    const matrix: Matrix = {};
    const nvmCommands: string[] = [];
    const it = objectIterator(config, sorter);
    let iteration = it.next();
    while (!iteration.done) {
      const { value: node } = iteration;
      const { value, key } = node;
      let skip = false;
      if (isEnvNode(value, node)) {
        if (matrix[key]) {
          matrix[key].push(String(value));
        } else {
          matrix[key] = [String(value)];
        }
        skip = true;
      } else if (isMatrixNode(value, node)) {
        if (matrix[key]) {
          matrix[key].push(...value.map(toString));
        } else {
          matrix[key] = value.map(toString);
        }
        skip = true;
      } else if (isIncludeMatrixNode(value, node)) {
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
      } else if (isNodeVersionNode(value, node)) {
        rawVersions.push(value);
        skip = true;
      } else if (isRunNode(value, node)) {
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
