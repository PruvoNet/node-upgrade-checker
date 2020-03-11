import {ICIResolver, ICIResolverOptions} from '../types';
import {parse} from 'yaml';
import * as path from 'path';
import * as fs from 'fs';

export const travisCiResolver: ICIResolver = async ({repoPath}: ICIResolverOptions): Promise<string[] | undefined> => {
    const fileName = path.join(repoPath, `.travis.yml`);
    try {
        const fileContents = await fs.promises.readFile(fileName, 'utf-8');
        const yaml = parse(fileContents);
        return yaml.node_js;
    } catch (e) {
    }
    return;
};
travisCiResolver.resolverName = `travisCi`;
