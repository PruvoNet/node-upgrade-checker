import * as path from 'path';
import {ISpecificCIResolverOptions, ISpecificCIResolver} from '../../interfaces/specificCIResolver';
import {inject, injectable} from 'inversify';
import {FS, TYPES} from '../../types';

const nodeVersionRegex = new RegExp(`image: node:(\\d+)`, 'ig');
const nodeVersionRegex2 = new RegExp(`image: \.+?\/node:(\\d+)`, 'ig');

@injectable()
export class CircleCiResolver extends ISpecificCIResolver {
    public readonly resolverName = `circleCi`;

    constructor(@inject(TYPES.FS) private fs: FS) {
        super();
    }

    public async resolve({repoPath}: ISpecificCIResolverOptions): Promise<string[] | undefined> {
        const fileName = path.join(repoPath, `.circleci`, `config.yml`);
        const versions = new Set<string>();
        try {
            const fileContents = await this.fs.promises.readFile(fileName, 'utf-8');
            let match: RegExpExecArray | null;
            do {
                match = nodeVersionRegex.exec(fileContents);
                if (match) {
                    versions.add(match[1]);
                }
            } while (match);
            do {
                match = nodeVersionRegex2.exec(fileContents);
                if (match) {
                    versions.add(match[1]);
                }
            } while (match);
            return Array.from(versions);
        } catch (e) {
        }
        return;
    }
}
