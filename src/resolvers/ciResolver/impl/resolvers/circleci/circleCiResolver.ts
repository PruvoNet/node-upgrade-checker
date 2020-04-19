import * as path from 'path';
import {
  ISpecificCIResolverOptions,
  ISpecificCIResolver,
  ISpecificCIResolverResponse,
} from '../../../interfaces/ISpecificCIResolver';
import { inject, injectable } from 'inversify';
import { FS, TYPES } from '../../../../../container/nodeModulesContainer';
import { ILoggerFactory } from '../../../../../utils/logger';
import { ILogger } from '../../../../../utils/logger/interfaces/ILogger';
import { CircleCiConfigParser } from './circleCiConfigParser';
import { parse } from 'yaml';

const ciFilePathV1 = `circle.yml`;
const ciFilePathV2 = path.join(`.circleci`, `config.yml`);
const resolverName = `CircleCi`;

const getCiFileNameV1 = (repoPath: string): string => {
  return path.join(repoPath, ciFilePathV1);
};

const getCiFileNameV2 = (repoPath: string): string => {
  return path.join(repoPath, ciFilePathV2);
};

@injectable()
export class CircleCiResolver extends ISpecificCIResolver {
  public readonly resolverName = resolverName;
  private readonly logger: ILogger;

  public static TAG = Symbol.for(resolverName);

  constructor(
    @inject(TYPES.FS) private fs: FS,
    private readonly configParser: CircleCiConfigParser,
    loggerFactory: ILoggerFactory
  ) {
    super();
    this.logger = loggerFactory.getLogger(`Circle CI Resolver`);
  }

  public async isRelevant({ repoPath }: ISpecificCIResolverOptions): Promise<boolean> {
    const fileNames = [getCiFileNameV1(repoPath), getCiFileNameV2(repoPath)];
    const accessPromises = fileNames.map(this.checkAccess.bind(this));
    const accessResults = await Promise.all(accessPromises);
    const matching = accessResults.filter((result) => result).length;
    this.logger.debug(`Found ${matching} relevant config file(s)`);
    return matching > 0;
  }

  public async resolve({ repoPath }: ISpecificCIResolverOptions): Promise<ISpecificCIResolverResponse> {
    const fileNames = [getCiFileNameV1(repoPath), getCiFileNameV2(repoPath)];
    const configPromises = fileNames.map(this.parseFile.bind(this));
    const parseResults = await Promise.all(configPromises);
    const versions = parseResults.reduce((currentVersions, result) => {
      if (result) {
        for (const version of result.nodeVersions) {
          currentVersions.add(version);
        }
      }
      return currentVersions;
    }, new Set<string>());
    this.logger.debug(`Found ${versions.size} node versions`);
    return {
      nodeVersions: versions,
    };
  }

  private async parseFile(fileName: string): Promise<ISpecificCIResolverResponse | undefined> {
    this.logger.debug(`Reading file ${fileName}`);
    let fileContents: string;
    try {
      fileContents = await this.fs.promises.readFile(fileName, `utf-8`);
    } catch (err) {
      this.logger.debug(`File ${fileName} does not exist`, err);
      return;
    }
    this.logger.debug(`Parsing yml config file ${fileName}`);
    const config = parse(fileContents);
    return this.configParser.parse({
      config,
    });
  }

  private async checkAccess(fileName: string): Promise<boolean> {
    this.logger.debug(`Checking if ${fileName} exists and readable`);
    try {
      await this.fs.promises.access(fileName, this.fs.constants.R_OK);
    } catch (err) {
      this.logger.debug(`File ${fileName} is not readable`, err);
      return false;
    }
    this.logger.debug(`File ${fileName} exists and readable`);
    return true;
  }
}
