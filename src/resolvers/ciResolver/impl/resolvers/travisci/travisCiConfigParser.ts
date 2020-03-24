import { ISpecificCIResolverResponse } from '../../../interfaces/ISpecificCIResolver';
import { injectable } from 'inversify';
import { ILoggerFactory } from '../../../../../utils/logger';
import { ILogger } from '../../../../../utils/logger/interfaces/ILogger';
import { objectIterator } from '../../../../../utils/objectIterator/objectIterator';
import { isNumber, isString } from 'ts-type-guards';
import { ITargetMatcher } from '../../../interfaces/ITargetMatcher';
import { parse, ParseEntry } from 'shell-quote';
import * as yargsParser from 'yargs-parser';
import { Options } from 'yargs-parser';
import { INvmHandler } from '../../../interfaces/INvmHandler';

const yargsOptions: Options = {
  configuration: {
    'parse-numbers': false,
  },
};

export interface ICircleCiConfigParserOptions {
  config: Record<string, any>;
}

const ltsRegex = new RegExp(`lts/(.+)`, `i`);

const argsFilter = (arg: ParseEntry): string[] => (typeof arg === `string` ? [arg] : []);

type Matrix = Record<string, string[]>;

const parseEnvVariable = (value: string, matrix: Matrix): void => {
  const envArray = parse(value).flatMap(argsFilter);
  const parsedEnvArray = yargsParser(envArray, yargsOptions)._;
  parsedEnvArray.forEach((env) => {
    const [currentKey, currentValue] = env.split(`=`, 2);
    if (matrix[currentKey]) {
      matrix[currentKey].push(currentValue);
    } else {
      matrix[currentKey] = [currentValue];
    }
  });
};

@injectable()
export class TravisCiConfigParser {
  private readonly logger: ILogger;

  constructor(
    private readonly nvmHandler: INvmHandler,
    private readonly targetMatcher: ITargetMatcher,
    loggerFactory: ILoggerFactory
  ) {
    this.logger = loggerFactory.getLogger(`Travis CI Config Parser`);
  }

  public async parse({ config }: ICircleCiConfigParserOptions): Promise<ISpecificCIResolverResponse> {
    this.logger.debug(`Parsing Travis Ci configuration`);
    const versions = new Set<string>();
    const matrix: Matrix = {};
    const nvmCommands: string[] = [];
    const it = objectIterator(config);
    let iteration = it.next();
    while (!iteration.done) {
      const { value: node } = iteration;
      const { value, key, isLeaf, parent } = node;
      let skip = false;
      if (isLeaf && parent.isNonRootNode && parent.key === `env` && isString(value)) {
        parseEnvVariable(value, matrix);
        skip = true;
      } else if (isLeaf && key === `env` && isString(value)) {
        parseEnvVariable(value, matrix);
        skip = true;
      } else if (
        isLeaf &&
        parent.isNonRootNode &&
        parent.parent.isNonRootNode &&
        parent.parent.key === `env` &&
        isString(value)
      ) {
        parseEnvVariable(value, matrix);
        skip = true;
      } else if (isLeaf && key === `node_js` && (isString(value) || isNumber(value))) {
        const version = this.parseVersion(value);
        versions.add(version);
      } else if (isLeaf && parent.isNonRootNode && parent.key === `node_js` && (isString(value) || isNumber(value))) {
        const version = this.parseVersion(value);
        versions.add(version);
      } else if (isLeaf && isString(value) && this.nvmHandler.isNvmCommand(value)) {
        this.logger.debug(`Found nvm command - ${value}`);
        nvmCommands.push(value);
      }
      iteration = it.next(skip);
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

  private parseVersion(version: string | number): string {
    const versionStr = String(version);
    if (versionStr === `node` || versionStr === `stable`) {
      return this.targetMatcher.getStableVersionPlaceholder();
    }
    if (versionStr === `lts/*`) {
      return this.targetMatcher.getLatestLtsVersionPlaceholder();
    }
    const ltsVersion = ltsRegex.exec(versionStr)?.[1];
    if (ltsVersion) {
      return this.targetMatcher.getLtsVersionPlaceholder({
        codename: ltsVersion,
      });
    }
    return versionStr;
  }
}
