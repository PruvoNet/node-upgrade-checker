'use strict';

import { getRepoDirName } from '../../../../../src/utils/git/impl/getRepoDirName';

const baseUrl = `https://github.com/PruvoNet/squiss-ts`;
const dirName = `squiss-ts`;

describe(`getRepoDirName`, () => {
  it(`should git repo dir name with .git suffix`, async () => {
    const name = await getRepoDirName({
      url: `${baseUrl}.git`,
    });
    expect(name).toBe(dirName);
  });

  it(`should git repo dir name without .git suffix`, async () => {
    const name = await getRepoDirName({
      url: `${baseUrl}`,
    });
    expect(name).toBe(dirName);
  });

  it(`should git repo dir name with .git suffix uppercase`, async () => {
    const name = await getRepoDirName({
      url: `${baseUrl}.git`.toUpperCase(),
    });
    expect(name).toBe(dirName);
  });

  it(`should git repo dir name without .git suffix uppercase`, async () => {
    const name = await getRepoDirName({
      url: `${baseUrl}`.toUpperCase(),
    });
    expect(name).toBe(dirName);
  });
});
