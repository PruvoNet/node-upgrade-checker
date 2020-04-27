import {
  IDependencyVersionRepositoryProvider,
  DependencyVersion,
  IConnectionSettings,
  IConnectionProvider,
} from '../../../../src/db';
import { container } from '../../../../src/container';
import * as tmp from 'tmp';
import moment = require('moment');
import { Connection } from 'typeorm';

const dateFormat = `YYYY-MM-DD`;
const releaseDate = moment.utc(`2015-10-02`, dateFormat);

describe(`dependency version repository provider e2e`, () => {
  let dependencyVersionRepositoryProvider: IDependencyVersionRepositoryProvider;
  let conn: Connection;

  beforeEach(async () => {
    container.snapshot();
    const tmpDir = tmp.dirSync().name;
    container.bind<IConnectionSettings>(IConnectionSettings).toConstantValue({
      databaseFilePath: tmpDir,
    });
    dependencyVersionRepositoryProvider = container.get(IDependencyVersionRepositoryProvider);
    const connectionProvider = container.get(IConnectionProvider);
    conn = await connectionProvider.getConnection();
  });

  afterEach(async () => {
    container.restore();
    await conn.close();
  });

  it(`should save entity`, async () => {
    const repo = await dependencyVersionRepositoryProvider.getRepository();
    const dependency = new DependencyVersion({
      version: `4.0.1`,
      name: `test dependency`,
      repoUrl: `https://www.github.com/example/test.git`,
      commitSha: `595e42ff-1a21-4c99-a0c9-f5ddbadbdce4`,
      releaseDate,
      engines: `>=6`,
      repoDirectory: `dir/dir2`,
      testScript: `test:unit`,
      buildScript: `build`,
    });
    await repo.save(dependency);
    const count = await repo.count();
    expect(count).toBe(1);
    const entities = await repo.find();
    expect(entities.length).toBe(1);
    expect(entities[0]).toEqual(dependency);
  });

  it(`should save multiple entities`, async () => {
    const repo = await dependencyVersionRepositoryProvider.getRepository();
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
    const dependency2 = new DependencyVersion({
      version: `5.0.1`,
      name: `test dependency2`,
      repoUrl: `https://www.github.com/example/test2.git`,
      commitSha: `595e42ff-1a21-4c99-a0c9-f5ddbadbdce4`,
      releaseDate: null,
      engines: null,
      repoDirectory: null,
      testScript: null,
      buildScript: null,
    });
    await repo.save([dependency, dependency2]);
    const count = await repo.count();
    expect(count).toBe(2);
    const entities = await repo.find();
    expect(entities.length).toBe(2);
    expect(entities[0]).toEqual(dependency);
    expect(entities[1]).toEqual(dependency2);
  });

  it(`should have proper key`, async () => {
    const repo = await dependencyVersionRepositoryProvider.getRepository();
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
    const dependency2 = new DependencyVersion({
      version: `4.0.1`,
      name: `test dependency`,
      repoUrl: `https://www.github.com/example/test2.git`,
      releaseDate,
      commitSha: `595e42ff-1a21-4c99-a0c9-f5ddbadbdce4`,
      engines: null,
      repoDirectory: null,
      testScript: null,
      buildScript: null,
    });
    await repo.save(dependency);
    await repo.save(dependency2);
    const count = await repo.count();
    expect(count).toBe(1);
  });

  it(`should find entities`, async () => {
    const repo = await dependencyVersionRepositoryProvider.getRepository();
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
    const dependency2 = new DependencyVersion({
      version: `5.0.1`,
      name: `test dependency2`,
      repoUrl: `https://www.github.com/example/test2.git`,
      commitSha: `595e42ff-1a21-4c99-a0c9-f5ddbadbdce4`,
      releaseDate,
      engines: null,
      repoDirectory: null,
      testScript: null,
      buildScript: null,
    });
    await repo.save([dependency, dependency2]);
    const entity = await repo.findOne({
      version: `4.0.1`,
    });
    expect(entity).toEqual(dependency);
  });

  it(`should update entities`, async () => {
    const repo = await dependencyVersionRepositoryProvider.getRepository();
    const dependency = new DependencyVersion({
      version: `4.0.1`,
      name: `test dependency`,
      repoUrl: `https://www.github.com/example/test.git`,
      commitSha: null,
      releaseDate,
      engines: null,
      repoDirectory: null,
      testScript: null,
      buildScript: null,
    });
    await repo.save(dependency);
    const entity = await repo.findOne({
      name: dependency.name,
      version: dependency.version,
    });
    expect(entity).toEqual(dependency);
    await repo.update(
      {
        name: dependency.name,
        version: dependency.version,
      },
      {
        commitSha: `v1.2.2`,
      }
    );
    const entity2 = await repo.findOne({
      name: dependency.name,
      version: dependency.version,
    });
    expect(entity2?.commitSha).toEqual(`v1.2.2`);
  });
});
