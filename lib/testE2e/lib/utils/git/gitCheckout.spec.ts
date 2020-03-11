'use strict';

import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';
import {expect} from 'chai';
import {IGitCheckout} from '../../../../utils/git/gitCheckout';
import {container} from '../../../../container';

const url = 'https://github.com/PruvoNet/squiss-ts';
const dirName = 'squiss-ts';

const verifyVersion = async (dir: string, version: string) => {
    const packageFileName = path.join(dir, 'package.json');
    const fileContent = await fs.promises.readFile(packageFileName, 'utf-8');
    const packageJson = JSON.parse(fileContent);
    packageJson.version.should.eql(version);
};

describe('checkout', () => {

    let tmpDir: string = '';
    let gitCheckout: IGitCheckout;

    beforeEach(() => {
        tmpDir = tmp.dirSync().name;
        container.snapshot();
        gitCheckout = container.get(IGitCheckout);
    });

    afterEach(() => {
        container.restore();
    });

    it('should checkout existing tag', async function () {
        this.timeout(5000);
        const name = await gitCheckout.checkoutRepo({
            url,
            baseDir: tmpDir,
            tag: '1.2.1',
        });
        const expected = path.join(tmpDir, dirName);
        name.should.eql(expected);
        await verifyVersion(name, '1.2.1');
        const name2 = await gitCheckout.checkoutRepo({
            url,
            baseDir: tmpDir,
            tag: '1.2.2',
        });
        name2.should.eql(expected);
        await verifyVersion(name, '1.2.2');
    });

    it('should checkout existing commit', async function () {
        this.timeout(5000);
        const name = await gitCheckout.checkoutRepo({
            url,
            baseDir: tmpDir,
            tag: '4.0.9',
            commitSha: 'e2942bb0f6a3d402cfef5714153263aef8e1466f',
        });
        const expected = path.join(tmpDir, dirName);
        name.should.eql(expected);
        await verifyVersion(name, '4.0.9');
        const name2 = await gitCheckout.checkoutRepo({
            url,
            baseDir: tmpDir,
            tag: '1.2.2',
            commitSha: 'e803d4cafb3a81d378117726a582cc7d561c5b47',
        });
        name2.should.eql(expected);
        await verifyVersion(name, '1.2.2');
    });

    it('should fail to checkout non existing tag', async function () {
        this.timeout(5000);
        const promise = gitCheckout.checkoutRepo({
            url,
            baseDir: tmpDir,
            tag: '0.0.1',
        });
        await expect(promise).to.be.eventually.rejectedWith(Error).and.have.property('message', 'Failed to locate tag 0.0.1');
    });

    it('should fail to checkout non existing commit', async function () {
        this.timeout(5000);
        const promise = gitCheckout.checkoutRepo({
            url,
            baseDir: tmpDir,
            tag: '0.0.1',
            commitSha: 'sdfsdfsdf',
        });
        await expect(promise).to.be.eventually.rejectedWith(Error).and.have.property('message', 'Failed to locate commit sdfsdfsdf');
    });

    it('should fail to checkout too many matching tags', async function () {
        this.timeout(5000);
        const promise = gitCheckout.checkoutRepo({
            url,
            baseDir: tmpDir,
            tag: '1',
        });
        await expect(promise).to.be.eventually.rejectedWith(Error).and.have.property('message').contain('Too many matching tags for tag 1');
    });

});
