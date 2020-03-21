import { loggerFactory } from '../../../../common/logger';
import { GitCheckout } from '../../../../../src/utils/git/impl/gitCheckout';
import { Git } from '../../../../../src/utils/git/impl/git';
import { FS } from '../../../../../src/container/nodeModulesContainer';

describe(`git checkout`, () => {
  const openRepoMock = jest.fn();
  const cloneRepoMock = jest.fn();
  const checkoutCommitMock = jest.fn();
  const locateTagMock = jest.fn();
  const gitSpy = ({
    openRepo: openRepoMock,
    cloneRepo: cloneRepoMock,
    checkoutCommit: checkoutCommitMock,
    locateTag: locateTagMock,
  } as any) as Git;
  const statMock = jest.fn();
  const mkdirMock = jest.fn();
  const fsSpy = ({
    promises: {
      stat: statMock,
      mkdir: mkdirMock,
    },
  } as any) as FS;
  const gitCheckout = new GitCheckout(gitSpy, fsSpy, loggerFactory);

  const url = `https://git.com/temp/test.git`;
  const baseDir = `/path/to/repo`;
  // const repoName = `test`;
  const fullDir = `/path/to/repo/test`;
  const tag = `test-tag`;
  const commitSha = `test-commit`;
  const repoPlaceHolder = Symbol.for(`repo`);

  beforeEach(() => {
    openRepoMock.mockReset();
    cloneRepoMock.mockReset();
    checkoutCommitMock.mockReset();
    locateTagMock.mockReset();
    statMock.mockReset();
    mkdirMock.mockReset();
  });

  it(`should checkout from existing repo`, async () => {
    statMock.mockResolvedValue(undefined);
    openRepoMock.mockResolvedValue(repoPlaceHolder);
    checkoutCommitMock.mockResolvedValue(undefined);
    const result = await gitCheckout.checkoutRepo({
      url,
      baseDir,
      tag,
      commitSha,
    });
    expect(result).toBe(fullDir);
    expect(statMock).toHaveBeenCalledTimes(1);
    expect(statMock).toHaveBeenCalledWith(fullDir);
    expect(openRepoMock).toHaveBeenCalledTimes(1);
    expect(openRepoMock).toHaveBeenCalledWith({
      path: fullDir,
    });
    expect(checkoutCommitMock).toHaveBeenCalledTimes(1);
    expect(checkoutCommitMock).toHaveBeenCalledWith({
      repo: repoPlaceHolder,
      commitSha,
    });
  });

  it(`should checkout after clone repo`, async () => {
    statMock.mockRejectedValue(new Error(`dummy message`));
    cloneRepoMock.mockResolvedValue(repoPlaceHolder);
    checkoutCommitMock.mockResolvedValue(undefined);
    const result = await gitCheckout.checkoutRepo({
      url,
      baseDir,
      tag,
      commitSha,
    });
    expect(result).toBe(fullDir);
    expect(statMock).toHaveBeenCalledTimes(1);
    expect(statMock).toHaveBeenCalledWith(fullDir);
    expect(mkdirMock).toHaveBeenCalledTimes(1);
    expect(mkdirMock).toHaveBeenCalledWith(fullDir);
    expect(cloneRepoMock).toHaveBeenCalledTimes(1);
    expect(cloneRepoMock).toHaveBeenCalledWith({
      dir: fullDir,
      url,
    });
    expect(checkoutCommitMock).toHaveBeenCalledTimes(1);
    expect(checkoutCommitMock).toHaveBeenCalledWith({
      repo: repoPlaceHolder,
      commitSha,
    });
  });

  it(`should checkout by locating tag`, async () => {
    statMock.mockResolvedValue(undefined);
    openRepoMock.mockResolvedValue(repoPlaceHolder);
    checkoutCommitMock.mockResolvedValue(undefined);
    locateTagMock.mockResolvedValue(commitSha);
    const result = await gitCheckout.checkoutRepo({
      url,
      baseDir,
      tag,
    });
    expect(result).toBe(fullDir);
    expect(statMock).toHaveBeenCalledTimes(1);
    expect(statMock).toHaveBeenCalledWith(fullDir);
    expect(openRepoMock).toHaveBeenCalledTimes(1);
    expect(openRepoMock).toHaveBeenCalledWith({
      path: fullDir,
    });
    expect(locateTagMock).toHaveBeenCalledTimes(1);
    expect(locateTagMock).toHaveBeenCalledWith({
      repo: repoPlaceHolder,
      tag,
    });
    expect(checkoutCommitMock).toHaveBeenCalledTimes(1);
    expect(checkoutCommitMock).toHaveBeenCalledWith({
      repo: repoPlaceHolder,
      commitSha,
    });
  });
});
