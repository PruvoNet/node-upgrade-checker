import * as yargsParser from 'yargs-parser';
import { injectable } from 'inversify';
import { Env, INvmHandler, EnvMatrix } from '../interfaces/INvmHandler';
import { ITargetMatcher } from '../interfaces/ITargetMatcher';
import { Options } from 'yargs-parser';
import { parse } from 'shell-quote';
import { isString } from 'ts-type-guards';

const LTS_REGEX = /lts\/(.+)/i;
const NEW_LINE_REGEX = /(?:\r\n|\r|\n)/g;

const yargsOptions: Options = {
  // eslint-disable-next-line id-blacklist
  boolean: [`-s`, `latest-npm`, `skip-default-packages`],
  // eslint-disable-next-line id-blacklist
  string: [`reinstall-packages-from`],
  configuration: {
    'parse-numbers': false,
  },
};

const expendMatrixAux = (matrix: EnvMatrix, keys: string[], keyIndex: number, environments: Env[], env: Env): void => {
  if (keyIndex >= keys.length) {
    environments.push(env);
    return;
  }
  const key = keys[keyIndex];
  const values = matrix[key];
  for (const value of values) {
    const currentEnv: Env = {
      ...env,
      [key]: value,
    };
    expendMatrixAux(matrix, keys, keyIndex + 1, environments, currentEnv);
  }
};

const expendMatrix = (matrix: EnvMatrix): Env[] => {
  const keys = Object.keys(matrix);
  const environments: Env[] = [];
  expendMatrixAux(matrix, keys, 0, environments, {});
  return environments;
};

const envIdentity = (key: string): string => {
  return key;
};

@injectable()
export class NvmHandler extends INvmHandler {
  constructor(private readonly targetMatcher: ITargetMatcher) {
    super();
  }

  public getNvmVersions(cmd: string, environments: Env[]): Set<string> {
    const versions = new Set<string>();
    if (environments.length === 0) {
      environments.push({});
    }
    environments.forEach((env) => {
      const version = this.getNvmVersion(cmd, env);
      if (version) {
        versions.add(version);
      }
    });
    return versions;
  }

  public getNvmVersionsFromMatrix(cmd: string, matrix: EnvMatrix): Set<string> {
    const environments: Env[] = expendMatrix(matrix);
    return this.getNvmVersions(cmd, environments);
  }

  public getNvmVersion(cmd: string, env: Env): string | undefined {
    const argsArray = this.getNvmCommandArgs(cmd, env);
    const parsedArgs = yargsParser(argsArray, yargsOptions);
    if (parsedArgs.lts === true) {
      return this.targetMatcher.getLatestLtsVersionPlaceholder();
    } else if (parsedArgs.lts) {
      return this.targetMatcher.getLtsVersionPlaceholder({ codename: parsedArgs.lts });
    }
    const freeParams = parsedArgs._;
    if (freeParams.length > 0) {
      const version = freeParams[freeParams.length - 1];
      if (version === `node`) {
        return this.targetMatcher.getStableVersionPlaceholder();
      } else if (version === `lts/*`) {
        return this.targetMatcher.getLatestLtsVersionPlaceholder();
      } else {
        const lts = LTS_REGEX.exec(version)?.[1];
        if (lts) {
          return this.targetMatcher.getLtsVersionPlaceholder({ codename: lts });
        }
        return version;
      }
    }
    return;
  }

  public isNvmCommand(cmd: string): boolean {
    return this.getNvmCommandArgs(cmd).length > 0;
  }

  private getNvmCommandArgs(cmd: string, env?: Env): string[] {
    const formattedCed = cmd.replace(NEW_LINE_REGEX, `;`);
    const rawArgsArray = parse(formattedCed, env || envIdentity);
    let startIndex: number | undefined;
    let reachedEnd = false;
    let args: string[] = [];
    rawArgsArray.forEach((arg, index) => {
      if (startIndex === undefined) {
        if (arg === `nvm`) {
          startIndex = index;
          args = [];
          return;
        }
      } else if (!reachedEnd) {
        if (index === startIndex + 1) {
          if (arg !== `install`) {
            startIndex = undefined;
          }
          return;
        } else if (!isString(arg)) {
          reachedEnd = true;
        } else if (arg) {
          if (index === rawArgsArray.length - 1) {
            reachedEnd = true;
          }
          args.push(arg);
        }
      }
    });
    if (reachedEnd && args) {
      return args;
    }
    return [];
  }
}
