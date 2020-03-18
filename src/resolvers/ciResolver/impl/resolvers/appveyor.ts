import * as path from 'path';
import {ISpecificCIResolverOptions, ISpecificCIResolver} from '../../interfaces/specificCIResolver';
import {inject, injectable} from 'inversify';
import {FS, TYPES} from '../../../../container/nodeModulesContainer';
import {parse} from 'yaml';

const nodeVersionRegex = /Install-Product node ([^\s]+)/i;
const nodeEnvRegex = /\$env:(.+)/i;

const nodeVersionMapper = (command: string | undefined) => {
    if (!command) {
        return;
    }
    const match = command.match(nodeVersionRegex);
    return match?.[1];
};

const emptyFilter = (command: any) => {
    return Boolean(command);
};

const psObjectMapper = (command: any): string | undefined => {
    return command.ps;
};

const envObjectMapper = (variable: string) => (command: any): string | undefined => {
    return command[variable];
};

const ciFileName = `.appveyor.yml`;
const resolverName = `appVeyor`;

@injectable()
export class AppVeyorResolver extends ISpecificCIResolver {
    public readonly resolverName = resolverName;

    constructor(@inject(TYPES.FS) private fs: FS) {
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
        const yaml = parse(fileContents);
        const installCommands: string[] = yaml.install;
        const nodeVersion = installCommands
            .map(psObjectMapper)
            .map(nodeVersionMapper)
            .filter(emptyFilter)[0];
        if (!nodeVersion) {
            throw new Error('failed to located node version in install commands');
        }
        const match = nodeVersion.match(nodeEnvRegex);
        if (!match) {
            return [nodeVersion];
        } else {
            const matrixVarName = match[1];
            const matrix: any[] = yaml.environment.matrix;
            return matrix
                .map(envObjectMapper(matrixVarName))
                .filter(emptyFilter) as string[];
        }
    }
}
