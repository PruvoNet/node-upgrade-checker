'use strict';

import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';
import { container } from '../../../../../src/container';
import { ITestResolver } from '../../../../../src/resolvers/testResolver';

const pageJsonFileName = `package.json`;
const testPackageJsonFileName = `test.package.json`;
const failTestPageJsonFileName = `test-fail.package.json`;
const testPackageJsonFile = path.join(__dirname, testPackageJsonFileName);
const failPackageJsonFile = path.join(__dirname, failTestPageJsonFileName);

describe(`test resolver`, () => {
  const testResolver = container.get(ITestResolver);

  it(`should resolve on test success`, async () => {
    const tmpDir = tmp.dirSync().name;
    await fs.promises.copyFile(testPackageJsonFile, path.join(tmpDir, pageJsonFileName));
    const result = await testResolver.resolve({
      repoPath: tmpDir,
    });
    expect(result.isMatch).toBe(true);
    expect(result.resolverName).toBe(`yarn run test`);
  }, 30000);

  it(`should fail yarn test flow`, async () => {
    const tmpDir = tmp.dirSync().name;
    await fs.promises.copyFile(failPackageJsonFile, path.join(tmpDir, pageJsonFileName));
    const result = await testResolver.resolve({
      repoPath: tmpDir,
    });
    expect(result.isMatch).toBe(false);
  }, 30000);
});
