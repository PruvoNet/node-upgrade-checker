import { Git } from '../../../../../src/utils/git/impl/git';
import { loggerFactory } from '../../../../common/logger';
import { SimpleGit } from 'simple-git/promise';

describe(`git`, () => {
  const tagsMock = jest.fn();
  const cloneMock = jest.fn();
  const checkoutMock = jest.fn();
  const simpleGitSpy = ({
    checkout: checkoutMock,
    clone: cloneMock,
    tags: tagsMock,
    _baseDir: `/tmp/testGitDir/`,
  } as any) as SimpleGit;
  const gitMock = jest.fn();
  gitMock.mockReturnValue(simpleGitSpy);
  const git = new Git(gitMock, loggerFactory);

  beforeEach(() => {
    tagsMock.mockReset();
    cloneMock.mockReset();
    checkoutMock.mockReset();
    gitMock.mockReset();
    gitMock.mockReturnValue(simpleGitSpy);
  });

  describe(`locate tag`, () => {
    it(`should locate tag`, async () => {
      tagsMock.mockResolvedValue({
        all: [`v1.0.0`, `v1.0.1`, `v1.0.2`, `v2.0.0`],
      });
      const tag = `1.0.2`;
      const tagResult = await git.locateTag({
        repo: simpleGitSpy,
        tag,
      });
      expect(tagsMock).toHaveBeenCalledTimes(1);
      expect(tagsMock).toHaveBeenCalledWith();
      expect(tagResult).toBe(`v1.0.2`);
    });
    it(`should fail if too many matching tags`, async () => {
      tagsMock.mockResolvedValue({
        all: [`v1.0.0`, `v1.0.1`, `v1.0.2`, `v2.0.0`],
      });
      const tag = `1.0`;
      const promise = git.locateTag({
        repo: simpleGitSpy,
        tag,
      });
      await expect(promise).rejects.toBeInstanceOf(Error);
      await expect(promise).rejects.toMatchObject({
        message: `Too many matching tags for tag 1.0 - [v1.0.0, v1.0.1, v1.0.2]`,
      });
      expect(tagsMock).toHaveBeenCalledTimes(1);
      expect(tagsMock).toHaveBeenCalledWith();
    });
    it(`should fail if not many matching tags`, async () => {
      tagsMock.mockResolvedValue({
        all: [`v1.0.0`, `v1.0.1`, `v1.0.2`, `v2.0.0`],
      });
      const tag = `3.0.0`;
      const promise = git.locateTag({
        repo: simpleGitSpy,
        tag,
      });
      await expect(promise).rejects.toBeInstanceOf(Error);
      await expect(promise).rejects.toMatchObject({
        message: `Failed to locate tag 3.0.0`,
      });
      expect(tagsMock).toHaveBeenCalledTimes(1);
      expect(tagsMock).toHaveBeenCalledWith();
    });
  });

  describe(`checkout commit`, () => {
    it(`should checkout commit`, async () => {
      const commitSha = `commitPlaceHolder`;
      checkoutMock.mockResolvedValue(undefined);
      await git.checkoutCommit({
        repo: simpleGitSpy,
        commitSha,
      });
      expect(checkoutMock).toHaveBeenCalledTimes(1);
      expect(checkoutMock).toHaveBeenCalledWith(commitSha);
    });
    it(`should fail to checkout commit`, async () => {
      const commitSha = `commitPlaceHolder`;
      checkoutMock.mockRejectedValue(new Error(`dummy message`));
      const promise = git.checkoutCommit({
        repo: simpleGitSpy,
        commitSha,
      });
      await expect(promise).rejects.toBeInstanceOf(Error);
      await expect(promise).rejects.toMatchObject({
        message: `Failed to checkout commit commitPlaceHolder`,
      });
      expect(checkoutMock).toHaveBeenCalledTimes(1);
      expect(checkoutMock).toHaveBeenCalledWith(commitSha);
    });
  });

  describe(`clone repo`, () => {
    it(`should clone repo`, async () => {
      const dir = `/path/to/repo`;
      const url = `https://git.com/temp/test.git`;
      cloneMock.mockResolvedValue(undefined);
      const repo = await git.cloneRepo({
        dir,
        url,
      });
      expect(repo).toBe(simpleGitSpy);
      expect(gitMock).toHaveBeenCalledTimes(1);
      expect(gitMock).toHaveBeenCalledWith(dir);
      expect(cloneMock).toHaveBeenCalledTimes(1);
      expect(cloneMock).toHaveBeenCalledWith(url, dir);
    });
  });

  describe(`open repo`, () => {
    it(`should open existing repo`, async () => {
      const path = `/path/to/repo`;
      const repo = await git.openRepo({
        path,
      });
      expect(repo).toBe(simpleGitSpy);
      expect(gitMock).toHaveBeenCalledTimes(1);
      expect(gitMock).toHaveBeenCalledWith(path);
    });
  });
});
