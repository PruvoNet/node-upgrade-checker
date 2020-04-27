import { DependencyVersion } from '../../../../src/db';
import moment = require('moment');
import { entityMetadataTester } from '../../../common/testers/entityMetadataTester';
import { Connection } from 'typeorm';
import { getInMemoryDb } from '../../../common/inMemoryDb';

describe(`dependencyVersion entity`, () => {
  entityMetadataTester(DependencyVersion, [
    {
      databaseName: `releaseDate`,
      isPrimary: false,
      isNullable: true,
      type: `text` as const,
    },
    {
      databaseName: `commitSha`,
      isPrimary: false,
      isNullable: true,
      type: `text` as const,
    },
    {
      databaseName: `engines`,
      isPrimary: false,
      isNullable: true,
      type: `text` as const,
    },
    {
      databaseName: `repoUrl`,
      isPrimary: false,
      isNullable: true,
      type: `text` as const,
    },
    {
      databaseName: `repoDirectory`,
      isPrimary: false,
      isNullable: true,
      type: `text` as const,
    },
    {
      databaseName: `testScript`,
      isPrimary: false,
      isNullable: true,
      type: `text` as const,
    },
    {
      databaseName: `buildScript`,
      isPrimary: false,
      isNullable: true,
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

  let connection: Connection;

  beforeAll(async () => {
    connection = await getInMemoryDb(DependencyVersion);
  });

  afterAll(async () => {
    await connection.close();
  });

  it(`should properly transform releaseDate field`, async () => {
    const dateFormat = `YYYY-MM-DD`;
    const releaseDate = moment.utc(`2015-10-02`, dateFormat);
    const dependencyVersion = new DependencyVersion({
      version: `4.0.1`,
      name: `test dependency`,
      repoUrl: `https://www.github.com/example/test.git`,
      commitSha: `595e42ff-1a21-4c99-a0c9-f5ddbadbdce4`,
      releaseDate,
      engines: null,
      repoDirectory: null,
      testScript: null,
      buildScript: null,
    });
    const repo = connection.getRepository(DependencyVersion);
    await repo.save(dependencyVersion);
    const entity = await repo.findOne();
    expect(entity).toEqual(dependencyVersion);
  });

  it(`should properly transform undefined releaseDate field`, async () => {
    const dependencyVersion = new DependencyVersion({
      version: `4.0.1`,
      name: `test dependency`,
      repoUrl: `https://www.github.com/example/test.git`,
      commitSha: `595e42ff-1a21-4c99-a0c9-f5ddbadbdce4`,
      releaseDate: null,
      engines: null,
      repoDirectory: null,
      testScript: null,
      buildScript: null,
    });
    const repo = connection.getRepository(DependencyVersion);
    await repo.save(dependencyVersion);
    const entity = await repo.findOne();
    expect(entity).toEqual(dependencyVersion);
  });

  it(`should set properties from constructor`, async () => {
    const releaseDate = moment.utc();
    const dependency = new DependencyVersion({
      version: `4.0.1`,
      name: `test dependency`,
      repoUrl: `https://www.github.com/example/test.git`,
      commitSha: `595e42ff-1a21-4c99-a0c9-f5ddbadbdce4`,
      releaseDate,
      engines: null,
      repoDirectory: null,
      testScript: null,
      buildScript: null,
    });
    expect(dependency).toEqual({
      version: `4.0.1`,
      name: `test dependency`,
      repoUrl: `https://www.github.com/example/test.git`,
      commitSha: `595e42ff-1a21-4c99-a0c9-f5ddbadbdce4`,
      releaseDate,
      engines: null,
      repoDirectory: null,
      testScript: null,
      buildScript: null,
    });
  });

  it(`should work with empty constructor`, async () => {
    const dependency = new DependencyVersion();
    expect(dependency.version).toBeUndefined();
    expect(dependency.name).toBeUndefined();
    expect(dependency.engines).toBeUndefined();
    expect(dependency.repoUrl).toBeUndefined();
    expect(dependency.repoDirectory).toBeUndefined();
    expect(dependency.commitSha).toBeUndefined();
    expect(dependency.releaseDate).toBeUndefined();
    expect(dependency.testScript).toBeUndefined();
    expect(dependency.buildScript).toBeUndefined();
  });
});
