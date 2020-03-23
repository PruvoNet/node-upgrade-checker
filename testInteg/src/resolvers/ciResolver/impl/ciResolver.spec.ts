import * as path from 'path';
import { ICIResolver } from '../../../../../src/resolvers/ciResolver';
import { resourcesDir } from '../../../../common';
import { container } from '../../../../../src/container';
import moment = require('moment');

const dateFormat = `YYYY-MM-DD`;
const packageReleaseDate = moment.utc(`2015-10-02`, dateFormat);

describe(`ci resolver`, () => {
  let ciResolver: ICIResolver;

  beforeEach(() => {
    container.snapshot();
    ciResolver = container.get(ICIResolver);
  });

  afterEach(() => {
    container.restore();
  });

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
      expect(result.isMatch).toBe(true);
      expect(result.resolverName).toBe(`travisCi`);
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

    it(`should not resolve node js from faulty travis configuration`, async () => {
      const repoPath = path.join(resourcesDir, `travisFaulty`);
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
      expect(result.isMatch).toBe(true);
      expect(result.resolverName).toBe(`appVeyor`);
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

    it(`should not resolve node js from faulty appveyor configuration`, async () => {
      const repoPath = path.join(resourcesDir, `appveyorFaulty`);
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
      const repoPath = path.join(resourcesDir, `circleci`);
      const result = await ciResolver.resolve({
        repoPath,
        targetNode: `10`,
        packageReleaseDate,
      });
      expect(result.isMatch).toBe(true);
      expect(result.resolverName).toBe(`circleCi`);
    });

    it(`should not resolve node js from circleci configuration`, async () => {
      const repoPath = path.join(resourcesDir, `circleci`);
      const result = await ciResolver.resolve({
        repoPath,
        targetNode: `2`,
        packageReleaseDate,
      });
      expect(result.isMatch).toBe(false);
    });

    it(`should not resolve node js from faulty circleci configuration`, async () => {
      const repoPath = path.join(resourcesDir, `circleciFaulty`);
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
      expect(result.isMatch).toBe(true);
      expect(result.resolverName).toBe(`githubActions`);
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

    it(`should not resolve node js from faulty github configuration`, async () => {
      const repoPath = path.join(resourcesDir, `githubFaulty`);
      const result = await ciResolver.resolve({
        repoPath,
        targetNode: `2`,
        packageReleaseDate,
      });
      expect(result.isMatch).toBe(false);
    });
  });
});
