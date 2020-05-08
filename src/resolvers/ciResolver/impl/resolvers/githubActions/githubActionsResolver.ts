import * as path from 'path';
import {
  ISpecificCIResolverOptions,
  ISpecificCIResolver,
  ISpecificCIResolverResponse,
} from '../../../interfaces/ISpecificCIResolver';
import { inject, injectable } from 'inversify';
import { FS, TYPES } from '../../../../../container/nodeModulesContainer';
import { ILoggerFactory, ILogger } from '../../../../../utils/logger';
import { GithubActionsConfigParser } from './githubActionsConfigParser';
import { parse } from 'yaml';

const ciFilesPath = path.join(`.github`, `workflows`);
const resolverName = `Github Actions`;

const getCiFilesPath = (repoPath: string): string => {
  return path.join(repoPath, ciFilesPath);
};

@injectable()
export class GithubActionsResolver extends ISpecificCIResolver {
  public readonly resolverName = resolverName;
  private readonly logger: ILogger;

  public static TAG = Symbol.for(resolverName);

  constructor(
    @inject(TYPES.FS) private readonly fs: FS,
    private readonly configParser: GithubActionsConfigParser,
    loggerFactory: ILoggerFactory
  ) {
    super();
    this.logger = loggerFactory.getLogger(`Github Actions Resolver`);
  }

  public async isRelevant({ repoPath }: ISpecificCIResolverOptions): Promise<boolean> {
    const folderName = getCiFilesPath(repoPath);
    this.logger.debug(`Checking if ${folderName} exists and readable`);
    try {
      await this.fs.promises.access(folderName, this.fs.constants.R_OK);
      this.logger.debug(`Folder ${folderName} exists and readable. Checking if is is a directory`);
      const stat = await this.fs.promises.stat(folderName);
      const isDirectory = stat.isDirectory();
      this.logger.debug(`Folder ${folderName} is directory? ${isDirectory}`);
      return isDirectory;
    } catch (err) {
      this.logger.debug(`Folder ${folderName} is not readable`, err);
      return false;
    }
  }

  public async resolve({ repoPath }: ISpecificCIResolverOptions): Promise<ISpecificCIResolverResponse> {
    const folderName = getCiFilesPath(repoPath);
    const files = await this.fs.promises.readdir(folderName);
    const ymlFiles = files.filter((name) => name.endsWith(`.yml`)).map((name) => path.join(folderName, name));
    const configPromises = ymlFiles.map(this.parseFile.bind(this));
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
}
