import { Git } from '../../../../../src/utils/git/impl/git';
import { loggerFactory } from '../../../../common/logger';
import { Checkout, Commit, Repository, Reset } from 'nodegit';

describe(`git`, () => {
  const openMock = jest.fn();
  const repositorySpy = {
    open: openMock,
  };
  const resetMock = jest.fn();
  const resetSpy = {
    reset: resetMock,
  };
  const checkoutSpy = {};
  const commitSpy = ({
    id: () => {
      return {
        tostrS: () => {
          return `test-commit-sha`;
        },
      };
    },
  } as any) as Commit;
  const nodeGitSpy = {
    Repository: repositorySpy,
    Reset: resetSpy,
    Checkout: checkoutSpy,
  } as any;
  const git = new Git(nodeGitSpy, loggerFactory);

  beforeEach(() => {
    resetMock.mockReset();
    openMock.mockReset();
  });

  describe(`checkout commit`, () => {
    it(`should open checkout commit`, async () => {
      const repoPlaceholder = ({} as any) as Repository;
      resetMock.mockResolvedValue(undefined);
      await git.checkoutCommit({
        repo: repoPlaceholder,
        commit: commitSpy,
      });
      expect(resetMock).toHaveBeenCalledTimes(1);
      expect(resetMock).toHaveBeenCalledWith(repoPlaceholder, commitSpy, Reset.TYPE.HARD, {
        checkoutStrategy: Checkout.STRATEGY.SAFE,
      });
    });
  });

  describe(`open repo`, () => {
    it(`should open existing repo`, async () => {
      const path = `/path/to/repo`;
      const repoPlaceholder = {};
      openMock.mockResolvedValue(repoPlaceholder);
      const repo = await git.openRepo({
        path,
      });
      expect(repo).toBe(repoPlaceholder);
      expect(openMock).toHaveBeenCalledTimes(1);
      expect(openMock).toHaveBeenCalledWith(path);
    });
  });
});
