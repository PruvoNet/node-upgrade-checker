import { injectable, multiInject } from 'inversify';
import * as path from 'path';
import { memoize } from '../../utils/memoize/memoize';
import { IConnectionSettings } from '../interfaces/IConnectionSettings';
import { IEntity, IEntityConstructor } from '../interfaces/IEntity';
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';
import { IConnectionOptionsProvider } from '../interfaces/IConnectionOptionsProvider';

const DB_FILE = `cache.db`;
const MIGRATIONS_DIR = path.join(__dirname, `..`, `migrations`);
const MIGRATIONS_DIR_RELATIVE = MIGRATIONS_DIR.slice(process.cwd().length + 1);
const MIGRATIONS_FILES = path.join(MIGRATIONS_DIR, `**`, `!(*.d).[jt]s`);

@injectable()
export class ConnectionOptionsProvider extends IConnectionOptionsProvider {
  constructor(
    private readonly settings: IConnectionSettings,
    @multiInject(IEntity) private readonly entities: IEntityConstructor[]
  ) {
    super();
  }

  @memoize()
  public getConnectionOptions(): ConnectionOptions {
    const connectionOptions: ConnectionOptions = {
      name: this.settings.migrationGenerationConfig ? `default` : this.settings.databaseFilePath,
      type: `sqlite`,
      database: path.join(this.settings.databaseFilePath, DB_FILE),
      synchronize: false,
      migrations: [MIGRATIONS_FILES],
      logging: false,
      dropSchema: false,
      entities: this.entities,
      cli: {
        migrationsDir: MIGRATIONS_DIR_RELATIVE,
      },
    };
    Object.defineProperty(connectionOptions, `migrationsRun`, {
      get: (): boolean => {
        return true;
      },
      set: (): void => {
        // Do nothing as we want migration generation to build incremental queries
      },
      enumerable: true,
    });
    return connectionOptions;
  }
}
