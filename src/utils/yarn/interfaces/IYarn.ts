import { injectable } from 'inversify';

export interface IYarnOptions {
  cwd: string;
}

@injectable()
export abstract class IYarn {
  public abstract async install(options: IYarnOptions): Promise<void>;

  public abstract async build(options: IYarnOptions): Promise<void>;

  public abstract async test(options: IYarnOptions): Promise<void>;
}
