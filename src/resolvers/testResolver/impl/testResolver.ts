import { injectable } from 'inversify';
import { IResolverResult } from '../../types';
import { ITestResolver, ITestResolverOptions } from '../interfaces/testResolver';
import { IYarn, IYarnOptions } from '../../../utils/yarn';

const resolverName = `yarn run test`;

@injectable()
export class TestResolver extends ITestResolver {
  constructor(private yarn: IYarn) {
    super();
  }

  public async resolve({ repoPath }: ITestResolverOptions): Promise<IResolverResult> {
    try {
      const yarnOptions: IYarnOptions = {
        cwd: repoPath,
      };
      await this.yarn.install(yarnOptions);
      await this.yarn.build(yarnOptions);
      await this.yarn.test(yarnOptions);
      return {
        isMatch: true,
        resolverName,
      };
    } catch (e) {}
    return {
      isMatch: false,
    };
  }
}
