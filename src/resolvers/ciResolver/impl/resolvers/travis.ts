import * as path from 'path';
import { ISpecificCIResolverOptions, ISpecificCIResolver, LTS_VERSION } from '../../interfaces/ISpecificCIResolver';
import { inject, injectable } from 'inversify';
import { FS, TYPES } from '../../../../container/nodeModulesContainer';
import { parse } from 'yaml';

const ciFileName = `.travis.yml`;
const resolverName = `travisCi`;

const ltsMapper = (nodeVersion: string): string => {
  if (nodeVersion === `lts/*`) {
    return LTS_VERSION;
  }
  return nodeVersion;
};

@injectable()
export class TravisCiResolver extends ISpecificCIResolver {
  public readonly resolverName = resolverName;

  constructor(@inject(TYPES.FS) private fs: FS) {
    super();
  }

  public async resolve({ repoPath }: ISpecificCIResolverOptions): Promise<string[] | undefined> {
    const fileName = path.join(repoPath, ciFileName);
    let fileContents: string;
    try {
      fileContents = await this.fs.promises.readFile(fileName, `utf-8`);
    } catch (e) {
      return;
    }
    const yaml = parse(fileContents);
    const versions = yaml.node_js;
    return versions.map(ltsMapper);
  }
}
