'use strict';

import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';
import { container } from '../../../../../src/container';
import { IYarn, IYarnOptions } from '../../../../../src/utils/yarn';

const pageJsonFileName = `package.json`;
const testPackageJsonFileName = `test.package.json`;
const failTestPageJsonFileName = `test-fail.package.json`;
const testPackageJsonFile = path.join(__dirname, testPackageJsonFileName);
const failPackageJsonFile = path.join(__dirname, failTestPageJsonFileName);

describe(`yarn`, () => {
  let yarn: IYarn;

  beforeEach(() => {
    container.snapshot();
    yarn = container.get(IYarn);
  });

  afterEach(() => {
    container.restore();
  });

  it(`should perform full yarn test flow`, async () => {
    const tmpDir = tmp.dirSync().name;
    await fs.promises.copyFile(testPackageJsonFile, path.join(tmpDir, pageJsonFileName));
    const yarnOptions: IYarnOptions = {
      cwd: tmpDir,
    };
    await yarn.install(yarnOptions);
    await yarn.build(yarnOptions);
    await yarn.test(yarnOptions);
    expect(true).toBe(true);
  }, 10000);

  it(`should fail yarn test flow`, async () => {
    const tmpDir = tmp.dirSync().name;
    await fs.promises.copyFile(failPackageJsonFile, path.join(tmpDir, pageJsonFileName));
    const yarnOptions: IYarnOptions = {
      cwd: tmpDir,
    };
    await yarn.install(yarnOptions);
    await yarn.build(yarnOptions);
    const promise = yarn.test(yarnOptions);
    await expect(promise).rejects.toBeInstanceOf(Error);
    await expect(promise).rejects.toMatchObject({
      message: expect.stringContaining(`yarn run test" exited with code: 1`),
    });
  }, 10000);
});
