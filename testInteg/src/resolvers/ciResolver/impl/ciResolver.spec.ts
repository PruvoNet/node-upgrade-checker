import * as path from 'path';
import { ICIResolver } from '../../../../../src/resolvers/ciResolver';
import { resourcesDir } from '../../../../common';
import { container } from '../../../../../src/container';
import moment = require('moment');

const dateFormat = `YYYY-MM-DD`;
const packageReleaseDate = moment.utc(`2015-10-02`, dateFormat);

describe(`ci resolver`, () => {
  const ciResolver = container.get(ICIResolver);

  it(`should not resolve node js from repo with no ci`, async () => {
    const repoPath = path.join(resourcesDir, `empty`);
    const result = await ciResolver.resolve({
      repoPath,
      targetNode: `2`,
      packageReleaseDate,
    });
    expect(result.isMatch).toBe(false);
  });

  describe(`travis`, () => {
    it(`should resolve node js from travis configuration`, async () => {
      const repoPath = path.join(resourcesDir, `travis`);
      const result = await ciResolver.resolve({
        repoPath,
        targetNode: `8`,
        packageReleaseDate,
      });
      expect(result).toEqual({
        isMatch: true,
        resolverName: `TravisCi`,
      });
    });

    it(`should not resolve node js from travis configuration`, async () => {
      const repoPath = path.join(resourcesDir, `travis`);
      const result = await ciResolver.resolve({
        repoPath,
        targetNode: `2`,
        packageReleaseDate,
      });
      expect(result.isMatch).toBe(false);
    });
  });

  describe(`appveyor`, () => {
    it(`should resolve node js from appveyor configuration`, async () => {
      const repoPath = path.join(resourcesDir, `appveyor`);
      const result = await ciResolver.resolve({
        repoPath,
        targetNode: `6`,
        packageReleaseDate,
      });
      expect(result).toEqual({
        isMatch: true,
        resolverName: `AppVeyor`,
      });
    });

    it(`should not resolve node js from appveyor configuration`, async () => {
      const repoPath = path.join(resourcesDir, `appveyor`);
      const result = await ciResolver.resolve({
        repoPath,
        targetNode: `2`,
        packageReleaseDate,
      });
      expect(result.isMatch).toBe(false);
    });
  });

  describe(`circleci`, () => {
    it(`should resolve node js from circleci configuration`, async () => {
      const repoPath = path.join(resourcesDir, `circleciV2`);
      const result = await ciResolver.resolve({
        repoPath,
        targetNode: `10`,
        packageReleaseDate,
      });
      expect(result).toEqual({
        isMatch: true,
        resolverName: `CircleCi`,
      });
    });

    it(`should not resolve node js from circleci configuration`, async () => {
      const repoPath = path.join(resourcesDir, `circleciV2`);
      const result = await ciResolver.resolve({
        repoPath,
        targetNode: `2`,
        packageReleaseDate,
      });
      expect(result.isMatch).toBe(false);
    });
  });

  describe(`github`, () => {
    it(`should resolve node js from github configuration`, async () => {
      const repoPath = path.join(resourcesDir, `github`);
      const result = await ciResolver.resolve({
        repoPath,
        targetNode: `10`,
        packageReleaseDate,
      });
      expect(result).toEqual({
        isMatch: true,
        resolverName: `Github Actions`,
      });
    });

    it(`should not resolve node js from github configuration`, async () => {
      const repoPath = path.join(resourcesDir, `github`);
      const result = await ciResolver.resolve({
        repoPath,
        targetNode: `2`,
        packageReleaseDate,
      });
      expect(result.isMatch).toBe(false);
    });
  });
});
