import {ICIResolver, ICIResolverOptions} from '../types';
import * as path from 'path';
import * as fs from 'fs';

const nodeVersionRegex = new RegExp(`node-version:\\s*(.+)`, 'ig');

export const githubActionsResolver: ICIResolver = async ({repoPath}: ICIResolverOptions)
    : Promise<string[] | undefined> => {
    const folderName = path.join(repoPath, `.github`, `workflows`);
    const foundVersions = new Set<string>();
    try {
        const files = await fs.promises.readdir(folderName);
        for (const fileName of files) {
            const fileContents = await fs.promises.readFile(path.join(folderName, fileName), 'utf-8');
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
};

githubActionsResolver.resolverName = `githubActions`;
