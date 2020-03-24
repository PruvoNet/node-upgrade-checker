import { ISpecificCIResolverResponse } from '../../../interfaces/ISpecificCIResolver';
import { injectable } from 'inversify';
import { ILoggerFactory } from '../../../../../utils/logger';
import { ILogger } from '../../../../../utils/logger/interfaces/ILogger';
import { objectIterator } from '../../../../../utils/objectIterator/objectIterator';
import { isNumber, isString } from 'ts-type-guards';
import { ITargetMatcher } from '../../../interfaces/ITargetMatcher';
import { INvmHandler } from '../../../interfaces/INvmHandler';

const nodeVersionRegex = /node:([^-.]+)-?/i;

type Matrix = Record<string, string[]>;

export interface ICircleCiConfigParserOptions {
  config: Record<string, any>;
}

@injectable()
export class CircleCiConfigParser {
  private readonly logger: ILogger;

  constructor(
    private readonly nvmHandler: INvmHandler,
    private readonly targetMatcher: ITargetMatcher,
    loggerFactory: ILoggerFactory
  ) {
    this.logger = loggerFactory.getLogger(`CircleCi Config Parser`);
  }

  public async parse({ config }: ICircleCiConfigParserOptions): Promise<ISpecificCIResolverResponse> {
    this.logger.debug(`Parsing Circle CI configuration`);
    const versions = new Set<string>();
    const matrix: Matrix = {};
    const nvmCommands: string[] = [];
    for (const node of objectIterator(config)) {
      const { value, key, isLeaf, isNonRootNode, parent } = node;
      if (
        isLeaf &&
        key === `image` &&
        isString(value) &&
        isNonRootNode &&
        parent.isNonRootNode &&
        parent.parent.isNonRootNode &&
        parent.parent.key === `docker`
      ) {
        this.parseVersion(value, versions);
      } else if (
        isLeaf &&
        parent.isNonRootNode &&
        parent.key === `environment` &&
        (isString(value) || isNumber(value))
      ) {
        if (matrix[key]) {
          matrix[key].push(String(value));
        } else {
          matrix[key] = [String(value)];
        }
      } else if (isLeaf && isString(value) && this.nvmHandler.isNvmCommand(value)) {
        this.logger.debug(`Found nvm command - ${value}`);
        nvmCommands.push(value);
      }
    }
    nvmCommands.forEach((command) => {
      this.nodeVersionCommandParser(command, matrix, versions);
    });
    this.logger.debug(`Finished parsing CircleCi configuration, Found ${versions.size} version(s)`);
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

  private parseVersion(value: string, versions: Set<string>): void {
    const version = nodeVersionRegex.exec(value)?.[1];
    if (version) {
      if (version === `latest` || version === `current`) {
        versions.add(this.targetMatcher.getStableVersionPlaceholder());
      } else if (version === `lts`) {
        versions.add(this.targetMatcher.getLatestLtsVersionPlaceholder());
      } else {
        if (!isNaN(parseInt(version.charAt(0), 10))) {
          versions.add(version);
        } else {
          versions.add(
            this.targetMatcher.getLtsVersionPlaceholder({
              codename: version,
            })
          );
        }
      }
    }
  }
}
