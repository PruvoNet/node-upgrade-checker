import { Dependency } from '../../../../src/db';
import { entityMetadataTester } from '../../../common/testers/entityMetadataTester';
describe(`dependency entity`, () => {
  entityMetadataTester(Dependency, [
    {
      databaseName: `reason`,
      isPrimary: false,
      isNullable: true,
      type: `text` as const,
    },
    {
      databaseName: `match`,
      isPrimary: false,
      isNullable: false,
      type: `boolean` as const,
    },
    {
      databaseName: `targetNode`,
      isPrimary: true,
      isNullable: false,
      type: `text` as const,
    },
    {
      databaseName: `version`,
      isPrimary: true,
      isNullable: false,
      type: `text` as const,
    },
    {
      databaseName: `name`,
      isPrimary: true,
      isNullable: false,
      type: `text` as const,
    },
  ]);

  it(`should set properties from constructor with match`, async () => {
    const dependency = new Dependency({
      targetNode: `12`,
      version: `4.0.1`,
      name: `test`,
      reason: `my reason`,
      match: true,
    });
    expect(dependency).toEqual({
      targetNode: `12`,
      version: `4.0.1`,
      name: `test`,
      reason: `my reason`,
      match: true,
    });
  });

  it(`should set properties from constructor with no match`, async () => {
    const dependency = new Dependency({
      targetNode: `12`,
      version: `4.0.1`,
      name: `test`,
      match: false,
      reason: null,
    });
    expect(dependency).toEqual({
      targetNode: `12`,
      version: `4.0.1`,
      name: `test`,
      match: false,
      reason: null,
    });
  });

  it(`should work with empty constructor`, async () => {
    const dependency = new Dependency();
    expect(dependency.targetNode).toBeUndefined();
    expect(dependency.version).toBeUndefined();
    expect(dependency.name).toBeUndefined();
    expect(dependency.reason).toBeUndefined();
    expect(dependency.match).toBeUndefined();
  });
});
