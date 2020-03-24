import { Git } from '../../../../../src/utils/git/impl/git';
import { loggerFactory } from '../../../../common/logger';
import { mock, mockReset } from 'jest-mock-extended';
import simplegit = require('simple-git/promise');
import { mockFn } from '../../../../common/safeMockFn';

describe(`git`, () => {
  const simpleGitMock = mock<simplegit.SimpleGit>();
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  simpleGitMock._baseDir.mockReturnValue(`/tmp/testGitDir/`);
  const gitMock = mockFn<typeof simplegit>();
  gitMock.mockReturnValue(simpleGitMock);
  const git = new Git(gitMock, loggerFactory);

  beforeEach(() => {
    mockReset(simpleGitMock);
    gitMock.mockClear();
  });

  describe(`locate tag`, () => {
    it(`should locate tag`, async () => {
      simpleGitMock.tags.mockResolvedValue({
        all: [`v1.0.0`, `v1.0.1`, `v1.0.2`, `v2.0.0`],
        latest: `latest`,
      });
      const tag = `1.0.2`;
      const tagResult = await git.locateTag({
        repo: simpleGitMock,
        tag,
      });
      expect(simpleGitMock.tags).toHaveBeenCalledTimes(1);
      expect(simpleGitMock.tags).toHaveBeenCalledWith();
      expect(tagResult).toBe(`v1.0.2`);
    });
    it(`should fail if too many matching tags`, async () => {
      simpleGitMock.tags.mockResolvedValue({
        all: [`v1.0.0`, `v1.0.1`, `v1.0.2`, `v2.0.0`],
        latest: `latest`,
      });
      const tag = `1.0`;
      const promise = git.locateTag({
        repo: simpleGitMock,
        tag,
      });
      await expect(promise).rejects.toBeInstanceOf(Error);
      await expect(promise).rejects.toMatchObject({
        message: `Too many matching tags for tag 1.0 - [v1.0.0, v1.0.1, v1.0.2]`,
      });
      expect(simpleGitMock.tags).toHaveBeenCalledTimes(1);
      expect(simpleGitMock.tags).toHaveBeenCalledWith();
    });
    it(`should fail if not many matching tags`, async () => {
      simpleGitMock.tags.mockResolvedValue({
        all: [`v1.0.0`, `v1.0.1`, `v1.0.2`, `v2.0.0`],
        latest: `latest`,
      });
      const tag = `3.0.0`;
      const promise = git.locateTag({
        repo: simpleGitMock,
        tag,
      });
      await expect(promise).rejects.toBeInstanceOf(Error);
      await expect(promise).rejects.toMatchObject({
        message: `Failed to locate tag 3.0.0`,
      });
      expect(simpleGitMock.tags).toHaveBeenCalledTimes(1);
      expect(simpleGitMock.tags).toHaveBeenCalledWith();
    });
  });

  describe(`checkout commit`, () => {
    it(`should checkout commit`, async () => {
      const commitSha = `commitPlaceHolder`;
      simpleGitMock.checkout.mockResolvedValue(undefined);
      await git.checkoutCommit({
        repo: simpleGitMock,
        commitSha,
      });
      expect(simpleGitMock.checkout).toHaveBeenCalledTimes(1);
      expect(simpleGitMock.checkout).toHaveBeenCalledWith(commitSha);
    });
    it(`should fail to checkout commit`, async () => {
      const commitSha = `commitPlaceHolder`;
      simpleGitMock.checkout.mockRejectedValue(new Error(`dummy message`));
      const promise = git.checkoutCommit({
        repo: simpleGitMock,
        commitSha,
      });
      await expect(promise).rejects.toBeInstanceOf(Error);
      await expect(promise).rejects.toMatchObject({
        message: `Failed to checkout commit commitPlaceHolder`,
      });
      expect(simpleGitMock.checkout).toHaveBeenCalledTimes(1);
      expect(simpleGitMock.checkout).toHaveBeenCalledWith(commitSha);
    });
  });

  describe(`clone repo`, () => {
    it(`should clone repo`, async () => {
      const dir = `/path/to/repo`;
      const url = `https://git.com/temp/test.git`;
      simpleGitMock.clone.mockResolvedValue(`dummy`);
      const repo = await git.cloneRepo({
        dir,
        url,
      });
      expect(repo).toBe(simpleGitMock);
      expect(gitMock).toHaveBeenCalledTimes(1);
      expect(gitMock).toHaveBeenCalledWith(dir);
      expect(simpleGitMock.clone).toHaveBeenCalledTimes(1);
      expect(simpleGitMock.clone).toHaveBeenCalledWith(url, dir);
    });
  });

  describe(`open repo`, () => {
    it(`should open existing repo`, async () => {
      const path = `/path/to/repo`;
      const repo = await git.openRepo({
        path,
      });
      expect(repo).toBe(simpleGitMock);
      expect(gitMock).toHaveBeenCalledTimes(1);
      expect(gitMock).toHaveBeenCalledWith(path);
    });
  });
});
