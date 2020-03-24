import { injectable } from 'inversify';
import { IResolverResult } from '../../types';
import { ITestResolver, ITestResolverOptions } from '../interfaces/ITestResolver';
import { IYarn, IYarnOptions } from '../../../utils/yarn';
import { ILoggerFactory } from '../../../utils/logger';
import { ILogger } from '../../../utils/logger/interfaces/ILogger';

const resolverName = `yarn run test`;

@injectable()
export class TestResolver extends ITestResolver {
  private readonly logger: ILogger;
  constructor(private readonly yarn: IYarn, loggerFactory: ILoggerFactory) {
    super();
    this.logger = loggerFactory.getLogger(`Test Resolver`);
  }

  public async resolve({ repoPath }: ITestResolverOptions): Promise<IResolverResult> {
    this.logger.info(`Running tests in ${repoPath}`);
    try {
      const yarnOptions: IYarnOptions = {
        cwd: repoPath,
      };
      await this.yarn.install(yarnOptions);
      await this.yarn.build(yarnOptions);
      await this.yarn.test(yarnOptions);
      this.logger.success(`Tests ran successfully`);
      return {
        isMatch: true,
        resolverName,
      };
    } catch (err) {
      this.logger.error(`Failed Running tests in ${repoPath}`);
      this.logger.debug(`Failed Running tests in ${repoPath}`, err);
      return {
        isMatch: false,
      };
    }
  }
}
