'use strict';

import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';
import {container} from '../../../../../src/container';
import {INpm, INpmOptions} from '../../../../../src/utils/npm';

const pageJsonFileName = 'package.json';
const testPackageJsonFileName = 'test.package.json';
const failTestPageJsonFileName = 'test-fail.package.json';
const testPackageJsonFile = path.join(__dirname, testPackageJsonFileName);
const failPackageJsonFile = path.join(__dirname, failTestPageJsonFileName);

const nvmBinDir = process.env.NVM_BIN || '';

describe('npm', () => {

    let npm: INpm;

    beforeEach(() => {
        container.snapshot();
        npm = container.get(INpm);
    });

    afterEach(() => {
        container.restore();
    });

    it('should perform full npm test flow', async () => {
        const tmpDir = tmp.dirSync().name;
        await fs.promises.copyFile(testPackageJsonFile, path.join(tmpDir, pageJsonFileName));
        const npmOptions: INpmOptions = {
            cwd: tmpDir,
            nvmBinDir,
        };
        await npm.install(npmOptions);
        await npm.build(npmOptions);
        await npm.test(npmOptions);
    }, 10000);

    it('should fail npm test flow', async () => {
        const tmpDir = tmp.dirSync().name;
        await fs.promises.copyFile(failPackageJsonFile, path.join(tmpDir, pageJsonFileName));
        const npmOptions: INpmOptions = {
            cwd: tmpDir,
            nvmBinDir,
        };
        await npm.install(npmOptions);
        await npm.build(npmOptions);
        expect.assertions(2);
        try {
            await npm.test(npmOptions);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toContain('npm run test" exited with code: 1');
        }
    }, 10000);

    it('should fail on faulty npm command', async () => {
        const tmpDir = tmp.dirSync().name;
        await fs.promises.copyFile(failPackageJsonFile, path.join(tmpDir, pageJsonFileName));
        const npmOptions: INpmOptions = {
            cwd: tmpDir,
            nvmBinDir: '/sdf/',
        };
        expect.assertions(2);
        try {
            await npm.install(npmOptions);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            expect(e.message).toContain('"/sdf/npm install" exited with code: -2');
        }
    }, 10000);

});
