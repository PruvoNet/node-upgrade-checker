'use strict';

import { container } from '../../../../../src/container';
import { IGetRepoDirName } from '../../../../../src/utils/git';

const baseUrl = `https://github.com/PruvoNet/squiss-ts`;
const dirName = `squiss-ts`;

describe(`getRepoDirName`, () => {
  let getRepoDirName: IGetRepoDirName;

  beforeEach(() => {
    container.snapshot();
    getRepoDirName = container.get(IGetRepoDirName);
  });

  afterEach(() => {
    container.restore();
  });

  it(`should git repo dir name with .git suffix`, async () => {
    const name = await getRepoDirName.get({
      url: `${baseUrl}.git`,
    });
    expect(name).toBe(dirName);
  });

  it(`should git repo dir name without .git suffix`, async () => {
    const name = await getRepoDirName.get({
      url: `${baseUrl}`,
    });
    expect(name).toBe(dirName);
  });

  it(`should git repo dir name with .git suffix uppercase`, async () => {
    const name = await getRepoDirName.get({
      url: `${baseUrl}.git`.toUpperCase(),
    });
    expect(name).toBe(dirName);
  });

  it(`should git repo dir name without .git suffix uppercase`, async () => {
    const name = await getRepoDirName.get({
      url: `${baseUrl}`.toUpperCase(),
    });
    expect(name).toBe(dirName);
  });
});
