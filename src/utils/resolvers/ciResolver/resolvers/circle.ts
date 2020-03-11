import {ICIResolver, ICIResolverOptions} from '../types';
import * as path from 'path';
import * as fs from 'fs';

const nodeVersionRegex = new RegExp(`image: node:(\\d+)`, 'ig');
const nodeVersionRegex2 = new RegExp(`image: \.+?\/node:(\\d+)`, 'ig');

export const circleCiResolver: ICIResolver = async ({repoPath}: ICIResolverOptions): Promise<string[] | undefined> => {
    const fileName = path.join(repoPath, `.circleci`, `config.yml`);
    const versions = new Set<string>();
    try {
        const fileContents = await fs.promises.readFile(fileName, 'utf-8');
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
};

circleCiResolver.resolverName = `circleCi`;
