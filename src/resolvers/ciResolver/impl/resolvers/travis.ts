import * as path from 'path';
import {ISpecificCIResolverOptions, ISpecificCIResolver, LTS_VERSION} from '../../interfaces/specificCIResolver';
import {inject, injectable} from 'inversify';
import {FS, TYPES, Yaml} from '../../types';

const ciFileName = `.travis.yml`;
const resolverName = `travisCi`;

const ltsMapper = (nodeVersion: string): string => {
    if (nodeVersion === 'lts/*') {
        return LTS_VERSION;
    }
    return nodeVersion;
};

@injectable()
export class TravisCiResolver extends ISpecificCIResolver {
    public readonly resolverName = resolverName;

    constructor(@inject(TYPES.FS) private fs: FS, @inject(TYPES.YAML) private yaml: Yaml) {
        super();
    }

    public async resolve({repoPath}: ISpecificCIResolverOptions): Promise<string[] | undefined> {
        const fileName = path.join(repoPath, ciFileName);
        let fileContents: string;
        try {
            fileContents = await this.fs.promises.readFile(fileName, 'utf-8');
        } catch (e) {
            return;
        }
        const yaml = this.yaml.parse(fileContents);
        const versions = yaml.node_js;
        return versions.map(ltsMapper);
    }
}
