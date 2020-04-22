import { ManifestParser } from '../../../../../src/utils/manifestParser/impl/manifestParser';
import { loggerFactory } from '../../../../common/logger';
import { IPredicate } from '../../../../../src/utils/predicateBuilder/predicateBuilder';
import { mock } from 'jest-mock-extended';
import { Manifest, PackageDist } from 'pacote';

const truthPredicate: IPredicate = () => true;
// const includeAll = {
//   peer: true,
//   dev: true,
//   optional: true,
//   prod: true,
// };
const excludeAll = {
  peer: false,
  dev: false,
  optional: false,
  prod: false,
};
const baseManifest: Manifest = {
  name: `name`,
  version: `3.0.1`,
  _from: `_from`,
  _resolved: `_resolved`,
  _integrity: `_integrity`,
  dist: mock<PackageDist>(),
  dependencies: {
    p1: `v:p1`,
    p2: `v:p2`,
  },
  devDependencies: {
    d1: `v:d1`,
    d2: `v:d2`,
  },
  peerDependencies: {
    p1: `v:p1`,
    p2: `v:p2`,
  },
  optionalDependencies: {
    o1: `v:o1`,
    o2: `v:o2`,
  },
};

describe(`package json parser`, () => {
  const manifestParser: ManifestParser = new ManifestParser(loggerFactory);

  it(`should respect include option and not return any dependencies`, async () => {
    const manifest: Manifest = {
      ...baseManifest,
    };
    const result = await manifestParser.parse({
      manifest,
      predicate: truthPredicate,
      include: excludeAll,
    });
    expect(result.dependencies.size).toBe(0);
  });
});
