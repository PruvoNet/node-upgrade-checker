'use strict';

import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';
import {container} from '../../../../../container';
import {INpm, INpmOptions} from '../../../../../utils/npm';
import {expect} from 'chai';

const pageJsonFileName = 'package.json';
const testPackageJsonFileName = 'test.package.json';
const failTestPageJsonFileName = 'test-fail.package.json';
const testPackageJsonFile = path.join(__dirname, testPackageJsonFileName);
const failPackageJsonFile = path.join(__dirname, failTestPageJsonFileName);

describe('npm', () => {

    let npm: INpm;

    beforeEach(() => {
        container.snapshot();
        npm = container.get(INpm);
    });

    afterEach(() => {
        container.restore();
    });

    it('should perform full npm test flow', async function () {
        this.timeout(10000);
        const tmpDir = tmp.dirSync().name;
        await fs.promises.copyFile(testPackageJsonFile, path.join(tmpDir, pageJsonFileName));
        const npmOptions: INpmOptions = {
            cwd: tmpDir,
            npmCommand: 'npm',
        };
        await npm.install(npmOptions);
        await npm.build(npmOptions);
        await npm.test(npmOptions);
    });

    it('should fail npm test flow', async function () {
        this.timeout(10000);
        const tmpDir = tmp.dirSync().name;
        await fs.promises.copyFile(failPackageJsonFile, path.join(tmpDir, pageJsonFileName));
        const npmOptions: INpmOptions = {
            cwd: tmpDir,
            npmCommand: 'npm',
        };
        await npm.install(npmOptions);
        await npm.build(npmOptions);
        const promise = npm.test(npmOptions);
        await expect(promise).to.be.eventually.rejectedWith(Error).and.have.property('message').contain('"npm run test" exited with code: 1');
    });

    it('should fail on faulty npm command', async function () {
        this.timeout(10000);
        const tmpDir = tmp.dirSync().name;
        await fs.promises.copyFile(failPackageJsonFile, path.join(tmpDir, pageJsonFileName));
        const npmOptions: INpmOptions = {
            cwd: tmpDir,
            npmCommand: 'faultyCommand',
        };
        const promise = npm.install(npmOptions);
        await expect(promise).to.be.eventually.rejectedWith(Error).and.have.property('message').contain('"faultyCommand install" exited with code: -2');
    });

});
