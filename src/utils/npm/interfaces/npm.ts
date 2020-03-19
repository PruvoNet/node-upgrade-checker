import { injectable } from 'inversify';

export interface INpmOptions {
  nvmBinDir: string;
  cwd: string;
}

@injectable()
export abstract class INpm {
  public abstract async install(options: INpmOptions): Promise<void>;

  public abstract async build(options: INpmOptions): Promise<void>;

  public abstract async test(options: INpmOptions): Promise<void>;
}
