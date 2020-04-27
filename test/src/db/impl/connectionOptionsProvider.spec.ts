import * as path from 'path';
import { Dependency, IConnectionSettings } from '../../../../src/db';
import * as tmp from 'tmp';
import { normalize, join } from 'path';
import { ConnectionOptionsProvider } from '../../../../src/db/impl/connectionOptionsProvider';

describe(`connection options provider`, () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = tmp.dirSync().name;
  });

  it(`should not be able to change the migrationsRun property`, async () => {
    const settings: IConnectionSettings = {
      databaseFilePath: tmpDir,
    };
    const connectionOptionsProvider = new ConnectionOptionsProvider(settings, [Dependency]);
    const options = connectionOptionsProvider.getConnectionOptions();
    expect(options.migrationsRun).toBe(true);
    Object.assign(options, {
      migrationsRun: false,
    });
    expect(options.migrationsRun).toBe(true);
  });

  it(`should generate options properly`, async () => {
    const settings: IConnectionSettings = {
      databaseFilePath: tmpDir,
    };
    const connectionOptionsProvider = new ConnectionOptionsProvider(settings, [Dependency]);
    const options = connectionOptionsProvider.getConnectionOptions();
    expect(options).toEqual({
      name: tmpDir,
      type: `sqlite`,
      database: path.join(tmpDir, `cache.db`),
      synchronize: false,
      migrationsRun: true,
      migrations: [normalize(join(__dirname, `../../../../src/db/migrations/**/!(*.d).[jt]s`))],
      cli: {
        migrationsDir: normalize(`src/db/migrations`),
      },
      logging: false,
      dropSchema: false,
      entities: [Dependency],
    });
  });

  it(`should generate options properly for migration`, async () => {
    const settings: IConnectionSettings = {
      databaseFilePath: tmpDir,
      migrationGenerationConfig: true,
    };
    const connectionOptionsProvider = new ConnectionOptionsProvider(settings, [Dependency]);
    const options = connectionOptionsProvider.getConnectionOptions();
    expect(options).toEqual({
      name: `default`,
      type: `sqlite`,
      database: path.join(tmpDir, `cache.db`),
      synchronize: false,
      migrationsRun: true,
      migrations: [normalize(join(__dirname, `../../../../src/db/migrations/**/!(*.d).[jt]s`))],
      cli: {
        migrationsDir: normalize(`src/db/migrations`),
      },
      logging: false,
      dropSchema: false,
      entities: [Dependency],
    });
  });

  it(`should cache connection options`, async () => {
    const settings: IConnectionSettings = {
      databaseFilePath: tmpDir,
    };
    const connectionOptionsProvider = new ConnectionOptionsProvider(settings, []);
    const options = connectionOptionsProvider.getConnectionOptions();
    const options2 = connectionOptionsProvider.getConnectionOptions();
    expect(options).toBe(options2);
  });
});
