'use strict';

import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';
import { container } from '../../../../../src/container';
import { INpm, INpmOptions } from '../../../../../src/utils/npm';

const pageJsonFileName = `package.json`;
const testPackageJsonFileName = `test.package.json`;
const failTestPageJsonFileName = `test-fail.package.json`;
const testPackageJsonFile = path.join(__dirname, testPackageJsonFileName);
const failPackageJsonFile = path.join(__dirname, failTestPageJsonFileName);

describe(`npm`, () => {
  let npm: INpm;

  beforeEach(() => {
    container.snapshot();
    npm = container.get(INpm);
  });

  afterEach(() => {
    container.restore();
  });

  it(`should perform full npm test flow`, async () => {
    const tmpDir = tmp.dirSync().name;
    await fs.promises.copyFile(testPackageJsonFile, path.join(tmpDir, pageJsonFileName));
    const npmOptions: INpmOptions = {
      cwd: tmpDir,
    };
    await npm.install(npmOptions);
    await npm.build(npmOptions);
    await npm.test(npmOptions);
    expect(true).toBe(true);
  }, 10000);

  it(`should fail npm test flow`, async () => {
    const tmpDir = tmp.dirSync().name;
    await fs.promises.copyFile(failPackageJsonFile, path.join(tmpDir, pageJsonFileName));
    const npmOptions: INpmOptions = {
      cwd: tmpDir,
    };
    await npm.install(npmOptions);
    await npm.build(npmOptions);
    const promise = npm.test(npmOptions);
    await expect(promise).rejects.toBeInstanceOf(Error);
    await expect(promise).rejects.toMatchObject({
      message: expect.stringContaining(`npm run test" exited with code: 1`),
    });
  }, 10000);
});
