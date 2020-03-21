'use strict';

import * as tmp from 'tmp';
import * as fs from 'fs';
import * as path from 'path';
import { container } from '../../../../../src/container';
import { IGitCheckout } from '../../../../../src/utils/git';

const url = `https://github.com/PruvoNet/squiss-ts`;
const dirName = `squiss-ts`;

const verifyVersion = async (dir: string, version: string): Promise<void> => {
  const packageFileName = path.join(dir, `package.json`);
  const fileContent = await fs.promises.readFile(packageFileName, `utf-8`);
  const packageJson = JSON.parse(fileContent);
  expect(packageJson.version).toBe(version);
};

const timeout = 60000;

describe(`git checkout`, () => {
  let tmpDir = ``;
  let gitCheckout: IGitCheckout;

  beforeEach(() => {
    tmpDir = tmp.dirSync().name;
    container.snapshot();
    gitCheckout = container.get(IGitCheckout);
  });

  afterEach(() => {
    container.restore();
  });

  it(
    `should checkout existing tag`,
    async () => {
      const name = await gitCheckout.checkoutRepo({
        url,
        baseDir: tmpDir,
        tag: `1.2.1`,
      });
      const expected = path.join(tmpDir, dirName);
      expect(name).toBe(expected);
      await verifyVersion(name, `1.2.1`);
      const name2 = await gitCheckout.checkoutRepo({
        url,
        baseDir: tmpDir,
        tag: `1.2.2`,
      });
      expect(name2).toBe(expected);
      await verifyVersion(name, `1.2.2`);
    },
    timeout
  );

  it(
    `should checkout existing commit`,
    async () => {
      const name = await gitCheckout.checkoutRepo({
        url,
        baseDir: tmpDir,
        tag: `4.0.9`,
        commitSha: `e2942bb0f6a3d402cfef5714153263aef8e1466f`,
      });
      const expected = path.join(tmpDir, dirName);
      expect(name).toBe(expected);
      await verifyVersion(name, `4.0.9`);
      const name2 = await gitCheckout.checkoutRepo({
        url,
        baseDir: tmpDir,
        tag: `1.2.2`,
        commitSha: `e803d4cafb3a81d378117726a582cc7d561c5b47`,
      });
      expect(name2).toBe(expected);
      await verifyVersion(name, `1.2.2`);
    },
    timeout
  );

  it(
    `should fail to checkout non existing tag`,
    async () => {
      const promise = gitCheckout.checkoutRepo({
        url,
        baseDir: tmpDir,
        tag: `0.0.1`,
      });
      await expect(promise).rejects.toBeInstanceOf(Error);
      await expect(promise).rejects.toHaveProperty(`message`, `Failed to locate tag 0.0.1`);
    },
    timeout
  );

  it(
    `should fail to checkout non existing commit`,
    async () => {
      const promise = gitCheckout.checkoutRepo({
        url,
        baseDir: tmpDir,
        tag: `0.0.1`,
        commitSha: `595e42ff-1a21-4c99-a0c9-f5ddbadbdce4`,
      });
      await expect(promise).rejects.toBeInstanceOf(Error);
      await expect(promise).rejects.toHaveProperty(
        `message`,
        `Failed to checkout commit 595e42ff-1a21-4c99-a0c9-f5ddbadbdce4`
      );
    },
    timeout
  );

  it(
    `should fail to checkout too many matching tags`,
    async () => {
      const promise = gitCheckout.checkoutRepo({
        url,
        baseDir: tmpDir,
        tag: `1`,
      });
      await expect(promise).rejects.toBeInstanceOf(Error);
      await expect(promise).rejects.toMatchObject({
        message: expect.stringContaining(`Too many matching tags for tag 1`),
      });
    },
    timeout
  );
});
