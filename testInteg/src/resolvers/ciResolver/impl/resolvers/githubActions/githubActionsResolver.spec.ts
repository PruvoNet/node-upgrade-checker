import * as path from 'path';
import { resourcesDir } from '../../../../../../common';
import { container } from '../../../../../../../src/container';
import { ISpecificCIResolver, SpecificCIResolverTags } from '../../../../../../../src/resolvers/ciResolver';

describe(`github actions resolver`, () => {
  const githubActionsResolver = container.getNamed(ISpecificCIResolver, SpecificCIResolverTags.githubActions);

  describe(`resolve`, () => {
    it(`should expose the proper name`, async () => {
      expect(githubActionsResolver.resolverName).toBe(`Github Actions`);
    });

    it(`should resolve node js from github actions configuration`, async () => {
      const repoPath = path.join(resourcesDir, `github`);
      const versions = await githubActionsResolver.resolve({
        repoPath,
      });
      expect(versions).toEqual({ nodeVersions: new Set([`12.x`, `6`, `10.x`, `4.x`]) });
    });
  });

  describe(`isRelevant`, () => {
    it(`should return true from relevant repo`, async () => {
      const repoPath = path.join(resourcesDir, `github`);
      const result = await githubActionsResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(true);
    });

    it(`should return false from non relevant repo`, async () => {
      const repoPath = path.join(resourcesDir, `empty`);
      const result = await githubActionsResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(false);
    });
  });
});
