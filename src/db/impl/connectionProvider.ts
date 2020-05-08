import { inject, injectable } from 'inversify';
import { Connection } from 'typeorm/connection/Connection';
import { memoize } from '../../utils/memoize/memoize';
import { IConnectionProvider } from '../interfaces/IConnectionProvider';
import { TypeOrm, TYPES } from '../../container/nodeModulesContainer';
import { ILogger, ILoggerFactory } from '../../utils/logger';
import { IConnectionOptionsProvider } from '../interfaces/IConnectionOptionsProvider';

@injectable()
export class ConnectionProvider extends IConnectionProvider {
  private readonly logger: ILogger;

  constructor(
    @inject(TYPES.TypeOrm) private readonly typeorm: TypeOrm,
    private readonly connectionOptionsProvider: IConnectionOptionsProvider,
    loggerFactory: ILoggerFactory
  ) {
    super();
    this.logger = loggerFactory.getLogger(`Connection Provider`);
  }

  @memoize()
  public async getConnection(): Promise<Connection> {
    const connectionOptions = this.connectionOptionsProvider.getConnectionOptions();
    this.logger.debug(`Creating connection of type ${connectionOptions.type} to db ${connectionOptions.database}`);
    const connection = await this.typeorm.createConnection(connectionOptions);
    this.logger.debug(`Connection created successfully`);
    const isOutOfSync = await this.isOutOfSync(connection);
    if (isOutOfSync) {
      throw new Error(`DB schema is out of sync`);
    }
    return connection;
  }

  private async isOutOfSync(connection: Connection): Promise<boolean> {
    const sqlInMemory = await connection.driver.createSchemaBuilder().log();
    return sqlInMemory.upQueries.length > 0;
  }
}
