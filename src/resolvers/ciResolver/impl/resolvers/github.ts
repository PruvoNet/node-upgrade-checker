import * as path from 'path';
import {ISpecificCIResolverOptions, ISpecificCIResolver} from '../../interfaces/specificCIResolver';
import {inject, injectable} from 'inversify';
import {FS, TYPES} from '../../types';

const nodeVersionRegex = new RegExp(`node-version:\\s*(.+)`, 'ig');

const ciFilePath = path.join(`.github`, `workflows`);
const resolverName = `githubActions`;

@injectable()
export class GithubActionsResolver extends ISpecificCIResolver {
    public readonly resolverName = resolverName;

    constructor(@inject(TYPES.FS) private fs: FS) {
        super();
    }

    public async resolve({repoPath}: ISpecificCIResolverOptions): Promise<string[] | undefined> {
        const folderName = path.join(repoPath, ciFilePath);
        const foundVersions = new Set<string>();
        try {
            const files = await this.fs.promises.readdir(folderName);
            for (const fileName of files) {
                const fileContents = await this.fs.promises.readFile(path.join(folderName, fileName), 'utf-8');
                let match: RegExpExecArray | null;
                do {
                    match = nodeVersionRegex.exec(fileContents);
                    if (match) {
                        const versionsStr = match[1];
                        if (!versionsStr.startsWith('$')) {
                            let versions: string[];
                            if (versionsStr.startsWith('[') && versionsStr.endsWith(']')) {
                                versions = versionsStr.substr(1, versionsStr.length - 2).split(',');
                            } else {
                                versions = [versionsStr];
                            }
                            versions.forEach((version) => {
                                version = version.replace(/['"]/g, '').trim();
                                foundVersions.add(version);
                            });
                        }
                    }
                } while (match);
            }
            return Array.from(foundVersions);
        } catch (e) {
        }
        return;
    }
}
