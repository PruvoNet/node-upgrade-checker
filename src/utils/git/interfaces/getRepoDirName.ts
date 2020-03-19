import { injectable } from 'inversify';

export interface IGetRepoDirNameOptions {
  url: string;
}

@injectable()
export abstract class IGetRepoDirName {
  public abstract async get(options: IGetRepoDirNameOptions): Promise<string>;
}
