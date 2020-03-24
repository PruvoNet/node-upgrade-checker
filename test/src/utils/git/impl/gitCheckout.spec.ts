import { loggerFactory } from '../../../../common/logger';
import { GitCheckout } from '../../../../../src/utils/git/impl/gitCheckout';
import { Git } from '../../../../../src/utils/git/impl/git';
import { normalize } from 'path';
import { mock, mockDeep, mockReset } from 'jest-mock-extended';
import * as fs from 'fs';
import { SimpleGit } from 'simple-git/promise';
import { Stats } from 'fs';

describe(`git checkout`, () => {
  const statsMock = mock<Stats>();
  const gitMock = mock<Git>();
  const fsMock = mockDeep<typeof fs>();
  const gitCheckout = new GitCheckout(gitMock, fsMock, loggerFactory);

  const url = `https://git.com/temp/test.git`;
  const baseDir = normalize(`/path/to/repo`);
  const fullDir = normalize(`/path/to/repo/test`);
  const tag = `test-tag`;
  const commitSha = `test-commit`;
  const repoPlaceHolder = (Symbol.for(`repo`) as any) as SimpleGit;

  beforeEach(() => {
    mockReset(fsMock);
    mockReset(gitMock);
  });

  it(`should checkout from existing repo`, async () => {
    fsMock.promises.stat.mockResolvedValue(statsMock);
    gitMock.openRepo.mockResolvedValue(repoPlaceHolder);
    gitMock.checkoutCommit.mockResolvedValue(undefined);
    const result = await gitCheckout.checkoutRepo({
      url,
      baseDir,
      tag,
      commitSha,
    });
    expect(result).toBe(fullDir);
    expect(fsMock.promises.stat).toHaveBeenCalledTimes(1);
    expect(fsMock.promises.stat).toHaveBeenCalledWith(fullDir);
    expect(gitMock.openRepo).toHaveBeenCalledTimes(1);
    expect(gitMock.openRepo).toHaveBeenCalledWith({
      path: fullDir,
    });
    expect(gitMock.checkoutCommit).toHaveBeenCalledTimes(1);
    expect(gitMock.checkoutCommit).toHaveBeenCalledWith({
      repo: repoPlaceHolder,
      commitSha,
    });
  });

  it(`should checkout after clone repo`, async () => {
    fsMock.promises.stat.mockRejectedValue(new Error(`dummy message`));
    gitMock.cloneRepo.mockResolvedValue(repoPlaceHolder);
    gitMock.checkoutCommit.mockResolvedValue(undefined);
    const result = await gitCheckout.checkoutRepo({
      url,
      baseDir,
      tag,
      commitSha,
    });
    expect(result).toBe(fullDir);
    expect(fsMock.promises.stat).toHaveBeenCalledTimes(1);
    expect(fsMock.promises.stat).toHaveBeenCalledWith(fullDir);
    expect(fsMock.promises.mkdir).toHaveBeenCalledTimes(1);
    expect(fsMock.promises.mkdir).toHaveBeenCalledWith(fullDir);
    expect(gitMock.cloneRepo).toHaveBeenCalledTimes(1);
    expect(gitMock.cloneRepo).toHaveBeenCalledWith({
      dir: fullDir,
      url,
    });
    expect(gitMock.checkoutCommit).toHaveBeenCalledTimes(1);
    expect(gitMock.checkoutCommit).toHaveBeenCalledWith({
      repo: repoPlaceHolder,
      commitSha,
    });
  });

  it(`should checkout by locating tag`, async () => {
    fsMock.promises.stat.mockResolvedValue(statsMock);
    gitMock.openRepo.mockResolvedValue(repoPlaceHolder);
    gitMock.checkoutCommit.mockResolvedValue(undefined);
    gitMock.locateTag.mockResolvedValue(commitSha);
    const result = await gitCheckout.checkoutRepo({
      url,
      baseDir,
      tag,
    });
    expect(result).toBe(fullDir);
    expect(fsMock.promises.stat).toHaveBeenCalledTimes(1);
    expect(fsMock.promises.stat).toHaveBeenCalledWith(fullDir);
    expect(gitMock.openRepo).toHaveBeenCalledTimes(1);
    expect(gitMock.openRepo).toHaveBeenCalledWith({
      path: fullDir,
    });
    expect(gitMock.locateTag).toHaveBeenCalledTimes(1);
    expect(gitMock.locateTag).toHaveBeenCalledWith({
      repo: repoPlaceHolder,
      tag,
    });
    expect(gitMock.checkoutCommit).toHaveBeenCalledTimes(1);
    expect(gitMock.checkoutCommit).toHaveBeenCalledWith({
      repo: repoPlaceHolder,
      commitSha,
    });
  });
});
