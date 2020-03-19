import { injectable } from 'inversify';
import { IGetRepoDirName, IGetRepoDirNameOptions } from '../interfaces/getRepoDirName';

const GIT_SUFFIX = `.git`;

@injectable()
export class GetRepoDirName extends IGetRepoDirName {
  public async get({ url }: IGetRepoDirNameOptions): Promise<string> {
    let result = url.toLowerCase();
    if (result.endsWith(GIT_SUFFIX)) {
      result = result.substr(0, result.length - GIT_SUFFIX.length);
    }
    result = result.substr(result.lastIndexOf(`/`) + 1);
    return result;
  }
}
