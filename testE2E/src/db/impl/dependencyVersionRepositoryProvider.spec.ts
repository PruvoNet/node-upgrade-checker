import {
  IDependencyVersionRepositoryProvider,
  DependencyVersion,
  IConnectionSettings,
  ConnectionSettings,
} from '../../../../src/db';
import { container } from '../../../../src/container';
import * as tmp from 'tmp';
// eslint-disable-next-line @typescript-eslint/quotes
import moment = require('moment');

const dateFormat = `YYYY-MM-DD`;
const releaseDate = moment.utc(`2015-10-02`, dateFormat);

describe(`dependency version repository provider e2e`, () => {
  let dependencyVersionRepositoryProvider: IDependencyVersionRepositoryProvider;

  beforeEach(() => {
    container.snapshot();
    const tmpDir = tmp.dirSync().name;
    container.bind<IConnectionSettings>(IConnectionSettings).toConstantValue(new ConnectionSettings(tmpDir, false));
    dependencyVersionRepositoryProvider = container.get(IDependencyVersionRepositoryProvider);
  });

  afterEach(() => {
    container.restore();
  });

  it(`should save entity`, async () => {
    const repo = await dependencyVersionRepositoryProvider.getRepository();
    const dependency = new DependencyVersion({
      version: `4.0.1`,
      name: `test dependency`,
      repoUrl: `https://www.github.com/example/test.git`,
      commitSha: `595e42ff-1a21-4c99-a0c9-f5ddbadbdce4`,
      releaseDate,
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
    });
    const dependency2 = new DependencyVersion({
      version: `5.0.1`,
      name: `test dependency2`,
      repoUrl: `https://www.github.com/example/test2.git`,
      commitSha: `595e42ff-1a21-4c99-a0c9-f5ddbadbdce4`,
      releaseDate,
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
    });
    const dependency2 = new DependencyVersion({
      version: `4.0.1`,
      name: `test dependency`,
      repoUrl: `https://www.github.com/example/test2.git`,
      releaseDate,
      commitSha: `595e42ff-1a21-4c99-a0c9-f5ddbadbdce4`,
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
    });
    const dependency2 = new DependencyVersion({
      version: `5.0.1`,
      name: `test dependency2`,
      repoUrl: `https://www.github.com/example/test2.git`,
      commitSha: `595e42ff-1a21-4c99-a0c9-f5ddbadbdce4`,
      releaseDate,
    });
    await repo.save([dependency, dependency2]);
    const entity = await repo.findOne({
      version: `4.0.1`,
    });
    expect(entity).toEqual(dependency);
  });
});
