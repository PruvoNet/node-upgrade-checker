import * as path from 'path';
import { resourcesDir } from '../../../../../../common';
import { container } from '../../../../../../../src/container';
import { ISpecificCIResolver, SpecificCIResolverTags } from '../../../../../../../src/resolvers/ciResolver';

describe(`travis ci resolver`, () => {
  const travisCiResolver = container.getNamed(ISpecificCIResolver, SpecificCIResolverTags.travisCi);

  describe(`resolve`, () => {
    it(`should expose the proper name`, async () => {
      expect(travisCiResolver.resolverName).toBe(`TravisCi`);
    });

    it(`should resolve node js from travis configuration`, async () => {
      const repoPath = path.join(resourcesDir, `travis`);
      const versions = await travisCiResolver.resolve({
        repoPath,
      });
      expect(versions).toEqual({
        nodeVersions: new Set([`6`, `__LTS__dummy`, `__LTS*__`, `8`, `9`, `10`, `__STABLE__`]),
      });
    });

    it(`should resolve lts version`, async () => {
      const repoPath = path.join(resourcesDir, `travisLts`);
      const versions = await travisCiResolver.resolve({
        repoPath,
      });
      expect(versions).toEqual({ nodeVersions: new Set([`10`, `__LTS*__`]) });
    });
  });

  describe(`isRelevant`, () => {
    it(`should return true from relevant repo`, async () => {
      const repoPath = path.join(resourcesDir, `travis`);
      const result = await travisCiResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(true);
    });

    it(`should return false from non relevant repo`, async () => {
      const repoPath = path.join(resourcesDir, `empty`);
      const result = await travisCiResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(false);
    });
  });
});
