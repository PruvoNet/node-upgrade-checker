import * as path from 'path';
import { GithubActionsResolver } from '../../../../../../src/resolvers/ciResolver/impl/resolvers/github';
import { resourcesDir } from '../../../../../common';
import * as fs from 'fs';

describe(`github actions`, () => {
  const githubActionsResolver = new GithubActionsResolver(fs);

  it(`should expose the proper name`, async () => {
    expect(githubActionsResolver.resolverName).toBe(`githubActions`);
  });

  it(`should resolve node js from github actions configuration`, async () => {
    const repoPath = path.join(resourcesDir, `github`);
    const versions = await githubActionsResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual([`8.x`, `12.x`, `6`, `10.x`, `4.x`]);
  });

  it(`should return empty array from faulty configuration`, async () => {
    const repoPath = path.join(resourcesDir, `githubFaulty`);
    const versions = await githubActionsResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual([]);
  });

  it(`should return undefined from non relevant repo`, async () => {
    const repoPath = path.join(resourcesDir, `empty`);
    const versions = await githubActionsResolver.resolve({
      repoPath,
    });
    expect(versions).toBeFalsy();
  });
});
