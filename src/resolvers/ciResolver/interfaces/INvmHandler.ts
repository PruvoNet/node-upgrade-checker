export type Env = Record<string, string>;
export type EnvMatrix = Record<string, string[]>;

export abstract class INvmHandler {
  public abstract isNvmCommand(cmd: string): boolean;
  public abstract getNvmVersion(cmd: string, env: Env): string | undefined;
  public abstract getNvmVersions(cmd: string, environments: Env[]): Set<string>;
  public abstract getNvmVersionsFromMatrix(cmd: string, matrix: EnvMatrix): Set<string>;
}
