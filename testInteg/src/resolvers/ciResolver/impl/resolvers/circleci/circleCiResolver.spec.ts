import * as path from 'path';
import { resourcesDir } from '../../../../../../common';
import { container } from '../../../../../../../src/container';
import { ISpecificCIResolver, SpecificCIResolverTags } from '../../../../../../../src/resolvers/ciResolver';

describe(`CircleCi Resolver`, () => {
  const circleCiResolver = container.getNamed(ISpecificCIResolver, SpecificCIResolverTags.circleCi);

  describe(`resolve`, () => {
    it(`should resolve node js from circleci configuration v1`, async () => {
      const repoPath = path.join(resourcesDir, `circleciV1`);
      const versions = await circleCiResolver.resolve({
        repoPath,
      });
      expect(versions).toEqual({ nodeVersions: new Set([`10`, `11`, `6`, `8`]) });
    });

    it(`should resolve node js from circleci configuration v2`, async () => {
      const repoPath = path.join(resourcesDir, `circleciV2`);
      const versions = await circleCiResolver.resolve({
        repoPath,
      });
      expect(versions).toEqual({ nodeVersions: new Set([`10`]) });
    });
  });

  describe(`isRelevant`, () => {
    it(`should return true from relevant repo v1`, async () => {
      const repoPath = path.join(resourcesDir, `circleciV1`);
      const result = await circleCiResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(true);
    });

    it(`should return true from relevant repo v2`, async () => {
      const repoPath = path.join(resourcesDir, `circleciV2`);
      const result = await circleCiResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(true);
    });

    it(`should return false from non relevant repo`, async () => {
      const repoPath = path.join(resourcesDir, `empty`);
      const result = await circleCiResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(false);
    });
  });
});
