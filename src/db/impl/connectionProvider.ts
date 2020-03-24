import { inject, injectable, multiInject } from 'inversify';
import { Connection } from 'typeorm/connection/Connection';
import * as path from 'path';
import { memoize } from '../../utils/memoize/memoize';
import { IConnectionProvider } from '../interfaces/IConnectionProvider';
import { IConnectionSettings } from '../interfaces/IConnectionSettings';
import { TypeOrm, TYPES } from '../../container/nodeModulesContainer';
import { IEntity, IEntityConstructor } from '../interfaces/IEntity';
import { ILoggerFactory } from '../../utils/logger';
import { ILogger } from '../../utils/logger/interfaces/ILogger';
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';

const DB_FILE = `cache.db`;

@injectable()
export class ConnectionProvider extends IConnectionProvider {
  private readonly logger: ILogger;

  constructor(
    private readonly settings: IConnectionSettings,
    @inject(TYPES.TypeOrm) private readonly typeorm: TypeOrm,
    @multiInject(IEntity) private readonly entities: IEntityConstructor[],
    loggerFactory: ILoggerFactory
  ) {
    super();
    this.logger = loggerFactory.getLogger(`Connection Provider`);
  }

  @memoize()
  public async getConnection(): Promise<Connection> {
    const connectionOptions: ConnectionOptions = {
      name: this.settings.databaseFilePath,
      type: `sqlite`,
      database: path.join(this.settings.databaseFilePath, DB_FILE),
      synchronize: true,
      logging: false,
      dropSchema: this.settings.dropSchema,
      entities: this.entities,
    };
    this.logger.debug(`Creating connection of type ${connectionOptions.type} to db ${connectionOptions.database}`);
    const connection = await this.typeorm.createConnection(connectionOptions);
    this.logger.debug(`Connection created successfully`);
    return connection;
  }
}
