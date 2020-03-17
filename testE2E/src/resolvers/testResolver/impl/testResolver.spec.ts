'use strict';

import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';
import {container} from '../../../../../src/container';
import {ITestResolver} from '../../../../../src/resolvers/testResolver';

const pageJsonFileName = 'package.json';
const testPackageJsonFileName = 'test.package.json';
const failTestPageJsonFileName = 'test-fail.package.json';
const testPackageJsonFile = path.join(__dirname, testPackageJsonFileName);
const failPackageJsonFile = path.join(__dirname, failTestPageJsonFileName);

const nvmBinDir = process.env.NVM_BIN || '';

describe('test resolver', () => {

    let testResolver: ITestResolver;

    beforeEach(() => {
        container.snapshot();
        testResolver = container.get(ITestResolver);
    });

    afterEach(() => {
        container.restore();
    });

    it('should resolve on test success', async () => {
        const tmpDir = tmp.dirSync().name;
        await fs.promises.copyFile(testPackageJsonFile, path.join(tmpDir, pageJsonFileName));
        const result = await testResolver.resolve({
            repoPath: tmpDir,
            nvmBinDir,
        });
        expect(result.isMatch).toBe(true);
        expect(result.resolverName).toBe('npm run test');
    }, 10000);

    it('should fail npm test flow', async () => {
        const tmpDir = tmp.dirSync().name;
        await fs.promises.copyFile(failPackageJsonFile, path.join(tmpDir, pageJsonFileName));
        const result = await testResolver.resolve({
            repoPath: tmpDir,
            nvmBinDir,
        });
        expect(result.isMatch).toBe(false);
    }, 10000);

});
