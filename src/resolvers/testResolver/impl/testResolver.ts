import { injectable } from 'inversify';
import { IResolverResult } from '../../types';
import { ITestResolver, ITestResolverOptions } from '../interfaces/testResolver';
import { INpm, INpmOptions } from '../../../utils/npm';

const resolverName = `npm run test`;

@injectable()
export class TestResolver extends ITestResolver {
  constructor(private npm: INpm) {
    super();
  }

  public async resolve({ repoPath }: ITestResolverOptions): Promise<IResolverResult> {
    try {
      const npmOptions: INpmOptions = {
        cwd: repoPath,
      };
      await this.npm.install(npmOptions);
      await this.npm.build(npmOptions);
      await this.npm.test(npmOptions);
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
