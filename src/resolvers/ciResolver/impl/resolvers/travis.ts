import * as path from 'path';
import {ISpecificCIResolverOptions, ISpecificCIResolver} from '../../interfaces/specificCIResolver';
import {inject, injectable} from 'inversify';
import {FS, TYPES, Yaml} from '../../types';

@injectable()
export class TravisCiResolver extends ISpecificCIResolver {
    public readonly resolverName = `travisCi`;

    constructor(@inject(TYPES.FS) private fs: FS, @inject(TYPES.YAML) private yaml: Yaml) {
        super();
    }

    public async resolve({repoPath}: ISpecificCIResolverOptions): Promise<string[] | undefined> {
        const fileName = path.join(repoPath, `.travis.yml`);
        try {
            const fileContents = await this.fs.promises.readFile(fileName, 'utf-8');
            const yaml = this.yaml.parse(fileContents);
            return yaml.node_js || [];
        } catch (e) {
        }
        return;
    }
}
