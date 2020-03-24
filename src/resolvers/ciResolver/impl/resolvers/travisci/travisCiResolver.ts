import * as path from 'path';
import {
  ISpecificCIResolverOptions,
  ISpecificCIResolver,
  ISpecificCIResolverResponse,
} from '../../../interfaces/ISpecificCIResolver';
import { inject, injectable } from 'inversify';
import { FS, TYPES } from '../../../../../container/nodeModulesContainer';
import { parse } from 'yaml';
import { ILoggerFactory } from '../../../../../utils/logger';
import { ILogger } from '../../../../../utils/logger/interfaces/ILogger';
import { TravisCiConfigParser } from './travisCiConfigParser';

const ciFileName = `.travis.yml`;
const resolverName = `TravisCi`;

const getCiFileName = (repoPath: string): string => {
  return path.join(repoPath, ciFileName);
};

@injectable()
export class TravisCiResolver extends ISpecificCIResolver {
  public readonly resolverName = resolverName;
  private readonly logger: ILogger;

  constructor(
    @inject(TYPES.FS) private fs: FS,
    private readonly configParser: TravisCiConfigParser,
    loggerFactory: ILoggerFactory
  ) {
    super();
    this.logger = loggerFactory.getLogger(`Travis CI Resolver`);
  }

  public async isRelevant({ repoPath }: ISpecificCIResolverOptions): Promise<boolean> {
    const fileName = getCiFileName(repoPath);
    this.logger.debug(`Checking if ${fileName} exists and readable`);
    try {
      await this.fs.promises.access(fileName, this.fs.constants.R_OK);
      this.logger.debug(`File ${fileName} exists and readable`);
      return true;
    } catch (err) {
      this.logger.debug(`File ${fileName} is not readable`, err);
      return false;
    }
  }

  public async resolve({ repoPath }: ISpecificCIResolverOptions): Promise<ISpecificCIResolverResponse> {
    const fileName = getCiFileName(repoPath);
    this.logger.debug(`Reading file ${fileName}`);
    const fileContents = await this.fs.promises.readFile(fileName, `utf-8`);
    this.logger.debug(`Parsing yml config file`);
    const config = parse(fileContents);
    return this.configParser.parse({
      config,
    });
  }
}
