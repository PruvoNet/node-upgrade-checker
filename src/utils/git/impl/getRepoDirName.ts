const GIT_SUFFIX = `.git`;

export interface IGetRepoDirNameOptions {
  url: string;
}

export const getRepoDirName = async ({ url }: IGetRepoDirNameOptions): Promise<string> => {
  let result = url.toLowerCase();
  if (result.endsWith(GIT_SUFFIX)) {
    result = result.substr(0, result.length - GIT_SUFFIX.length);
  }
  result = result.substr(result.lastIndexOf(`/`) + 1);
  return result;
};
