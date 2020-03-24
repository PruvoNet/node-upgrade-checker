import * as path from 'path';
import { ISpecificCIResolverOptions, ISpecificCIResolver } from '../../interfaces/ISpecificCIResolver';
import { inject, injectable } from 'inversify';
import { FS, TYPES } from '../../../../container/nodeModulesContainer';
import { parse } from 'yaml';

const nodeVersionRegex = /node ([^\s]+)/i;
const nodeVersionInstallRegex = /Install-Product node ([^\s]+)/i;
const nvmInstallRegex = /nvm install ([^\s]+)/i;
const nodeEnvRegex = /\$env:(.+)/i;

const nodeVersionInstallMapper = (command: string | undefined): string | undefined => {
  if (!command) {
    return;
  }
  const match = nodeVersionInstallRegex.exec(command) || nvmInstallRegex.exec(command);
  return match?.[1];
};

const nodeVersionMapper = (command: string): string | undefined => {
  const match = nodeVersionRegex.exec(command);
  return match?.[1];
};

const emptyFilter = (command: any): boolean => {
  return Boolean(command);
};

const psObjectMapper = (command: any): string | undefined => {
  return command.ps || command.cmd || command.sh;
};

const envObjectMapper = (variable: string) => (command: any): string | undefined => {
  return command[variable];
};

const parseStack = (stack: string | undefined, versions: string[]): void => {
  if (!stack) {
    return;
  }
  stack
    .split(`,`)
    .map(nodeVersionMapper)
    .forEach((version) => {
      if (version) {
        versions.push(version);
      }
    });
};

const ciFileName = `.appveyor.yml`;
const resolverName = `appVeyor`;

@injectable()
export class AppVeyorResolver extends ISpecificCIResolver {
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
    const versions: string[] = [];
    const yaml = parse(fileContents);
    const stack = yaml.stack;
    parseStack(stack, versions);
    const installCommands: string[] = yaml.install;
    if (!installCommands) {
      return versions;
    }
    const nodeVersion = installCommands.map(psObjectMapper).map(nodeVersionInstallMapper).filter(emptyFilter)[0];
    if (!nodeVersion) {
      return versions;
    }
    const match = nodeEnvRegex.exec(nodeVersion);
    if (!match) {
      versions.push(nodeVersion);
      return versions;
    } else {
      const matrixVarName = match[1];
      const environment: any[] = yaml.environment?.matrix || yaml.environment;
      if (!environment) {
        return versions;
      }
      return versions.concat(environment.map(envObjectMapper(matrixVarName)).filter(emptyFilter) as string[]);
    }
  }
}
