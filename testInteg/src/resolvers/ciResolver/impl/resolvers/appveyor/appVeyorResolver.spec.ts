import * as path from 'path';
import { resourcesDir } from '../../../../../../common';
import { container } from '../../../../../../../src/container';
import { ISpecificCIResolver, SpecificCIResolverTags } from '../../../../../../../src/resolvers/ciResolver';

describe(`AppVeyor Resolver`, () => {
  const appVeyorResolver = container.getNamed(ISpecificCIResolver, SpecificCIResolverTags.appVeyor);

  describe(`resolve`, () => {
    it(`should resolve node js from appveyor configuration`, async () => {
      const repoPath = path.join(resourcesDir, `appveyor`);
      const versions = await appVeyorResolver.resolve({
        repoPath,
      });
      expect(versions).toEqual({ nodeVersions: new Set([`4`, `6`, `1.0`]) });
    });
  });

  describe(`isRelevant`, () => {
    it(`should return true from relevant repo`, async () => {
      const repoPath = path.join(resourcesDir, `appveyor`);
      const result = await appVeyorResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(true);
    });

    it(`should return false from non relevant repo`, async () => {
      const repoPath = path.join(resourcesDir, `empty`);
      const result = await appVeyorResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(false);
    });
  });
});
