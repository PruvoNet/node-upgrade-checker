import { ISpecificCIResolverResponse } from '../../../interfaces/ISpecificCIResolver';
import { injectable } from 'inversify';
import { ILoggerFactory, ILogger } from '../../../../../utils/logger';
import { INode, keySorter, NodeSorter, objectIterator } from '../../../../../utils/objectIterator/objectIterator';
import { isString } from 'ts-type-guards';
import { INvmHandler } from '../../../interfaces/INvmHandler';
import { isStringOrNumber } from '../../../../../utils/types/typeGuards';
import { Key, StringOrNumber } from '../../../../../utils/types/types';

const nodeVersionRegex = /node ([^\s]+)/i;
const nodeVersionInstallRegex = /Install-Product node ([^\s]+)/i;
const nodeEnvReplaceRegex = /\$env:(.+)/gi;
const nodeEnvRegex = /\$env:(.+)/i;

type Matrix = Record<string, string>[];

const nodeVersionMapper = (command: string): string | undefined => {
  const match = nodeVersionRegex.exec(command);
  return match?.[1];
};

const parseStack = (stack: string, versions: Set<string>): void => {
  stack
    .split(`,`)
    .map(nodeVersionMapper)
    .forEach((version) => {
      if (version) {
        versions.add(version);
      }
    });
};

const envOrStackChecker = (node: INode): boolean => {
  return node.key === `environment` || node.key === `stack`;
};

const sorter: NodeSorter = (a: INode, b: INode) => {
  if (a.depth === 0) {
    if (envOrStackChecker(a)) {
      return -1;
    } else if (envOrStackChecker(b)) {
      return 1;
    }
  }
  if (a.parent.isNonRootNode && a.parent.key === `environment`) {
    if (a.key === `matrix`) {
      return -1;
    } else if (b.key === `matrix`) {
      return 1;
    }
  }
  return keySorter(a, b);
};

export interface IAppVeyorConfigParserOptions {
  config: Record<string, unknown>;
}

const coerceString = (o: Record<Key, unknown>): Record<string, string> => {
  const newObj: Record<string, string> = {};
  Object.keys(o).forEach((k) => {
    newObj[k] = String(o[k]);
  });
  return newObj;
};

const isStackNode = (value: unknown, node: INode): value is string => {
  const { parent, isLeaf, key } = node;
  return !parent.isNonRootNode && isLeaf && key === `stack` && isString(value);
};

const isMatrixNode = (node: INode): boolean => {
  const { parent, isLeaf } = node;
  return (
    !isLeaf &&
    parent.isNonRootNode &&
    parent.key === `matrix` &&
    parent.parent.isNonRootNode &&
    parent.parent.key === `environment`
  );
};

const isGlobalEnvNode = (value: unknown, node: INode): value is StringOrNumber => {
  const { parent, isLeaf } = node;
  return (
    isLeaf &&
    parent.isNonRootNode &&
    parent.key === `global` &&
    parent.parent.isNonRootNode &&
    parent.parent.key === `environment` &&
    isStringOrNumber(value)
  );
};

const isEnvNode = (value: unknown, node: INode): value is StringOrNumber => {
  const { parent, isLeaf } = node;
  return isLeaf && parent.isNonRootNode && parent.key === `environment` && isStringOrNumber(value);
};

const isCommandNode = (value: unknown, node: INode): value is string => {
  const { key, isLeaf } = node;
  return isLeaf && (key === `ps` || key === `sh` || key === `cmd`) && isString(value);
};

@injectable()
export class AppVeyorConfigParser {
  private readonly logger: ILogger;

  constructor(private readonly nvmHandler: INvmHandler, loggerFactory: ILoggerFactory) {
    this.logger = loggerFactory.getLogger(`AppVeyor Config Parser`);
  }

  public async parse({ config }: IAppVeyorConfigParserOptions): Promise<ISpecificCIResolverResponse> {
    this.logger.debug(`Parsing AppVeyor configuration`);
    const versions = new Set<string>();
    const matrix: Matrix = [];
    const commands: string[] = [];
    const it = objectIterator(config, sorter);
    let iteration = it.next();
    while (!iteration.done) {
      const { value: node } = iteration;
      const { value, key } = node;
      let skip = false;
      if (isStackNode(value, node)) {
        parseStack(value, versions);
      } else if (!node.isLeaf && isMatrixNode(node)) {
        matrix.push(coerceString(node.value));
        skip = true;
      } else if (isGlobalEnvNode(value, node)) {
        matrix.forEach((mat) => {
          mat[key] = String(value);
        });
      } else if (isEnvNode(value, node)) {
        if (matrix.length === 0) {
          matrix.push({});
        }
        matrix.forEach((mat) => {
          mat[key] = String(value);
        });
      } else if (isCommandNode(value, node)) {
        commands.push(value);
        skip = true;
      }
      iteration = it.next(skip);
    }
    commands.forEach((command) => {
      this.nodeVersionCommandParser(command, matrix, versions);
    });
    this.logger.debug(`Parsed AppVeyor configuration with the following matrix - ${JSON.stringify(matrix)}`);
    this.logger.debug(`Finished parsing AppVeyor configuration, Found ${versions.size} version(s)`);
    return {
      nodeVersions: versions,
    };
  }

  private nodeVersionCommandParser(command: string, matrix: Matrix, versions: Set<string>): void {
    if (this.nvmHandler.isNvmCommand(command)) {
      this.logger.debug(`Found nvm command - ${command}`);
      const normalizedCommand = command.replace(nodeEnvReplaceRegex, `\${$1}`);
      const foundVersions = this.nvmHandler.getNvmVersions(normalizedCommand, matrix);
      for (const version of foundVersions) {
        versions.add(version);
      }
    } else {
      const version = nodeVersionInstallRegex.exec(command)?.[1];
      if (version) {
        const envKey = nodeEnvRegex.exec(version)?.[1];
        if (envKey) {
          matrix.forEach((mat) => {
            const matrixVersion = mat[envKey];
            if (matrixVersion) {
              versions.add(String(matrixVersion));
            }
          });
        } else {
          versions.add(version);
        }
      }
    }
  }
}
