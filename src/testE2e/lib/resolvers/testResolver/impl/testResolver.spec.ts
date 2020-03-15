'use strict';

import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';
import {container} from '../../../../../container';
import {ITestResolver} from '../../../../../resolvers/testResolver';

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

    it('should resolve on test success', async function () {
        this.timeout(10000);
        const tmpDir = tmp.dirSync().name;
        await fs.promises.copyFile(testPackageJsonFile, path.join(tmpDir, pageJsonFileName));
        const result = await testResolver.resolve({
            repoPath: tmpDir,
            nvmBinDir,
        });
        result.isMatch.should.eql(true);
        result.resolverName!.should.eql('npm run test');
    });

    it('should fail npm test flow', async function () {
        this.timeout(10000);
        const tmpDir = tmp.dirSync().name;
        await fs.promises.copyFile(failPackageJsonFile, path.join(tmpDir, pageJsonFileName));
        const result = await testResolver.resolve({
            repoPath: tmpDir,
            nvmBinDir,
        });
        result.isMatch.should.eql(false);
    });

});
