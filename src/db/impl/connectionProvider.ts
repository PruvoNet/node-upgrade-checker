import { inject, injectable, multiInject } from 'inversify';
import { Connection } from 'typeorm/connection/Connection';
import * as path from 'path';
import { memoize } from '../../utils/memoize/memoize';
import { IConnectionProvider } from '../interfaces/IConnectionProvider';
import { IConnectionSettings } from '../interfaces/IConnectionSettings';
import { TypeOrm, TYPES } from '../../container/nodeModulesContainer';
import { IEntity, IEntityConstructor } from '../interfaces/IEntity';

const DB_FILE = `cache.db`;

@injectable()
export class ConnectionProvider extends IConnectionProvider {
  constructor(
    private settings: IConnectionSettings,
    @inject(TYPES.TypeOrm) private typeorm: TypeOrm,
    @multiInject(IEntity) private entities: IEntityConstructor[]
  ) {
    super();
  }

  @memoize()
  public async getConnection(): Promise<Connection> {
    return await this.typeorm.createConnection({
      name: this.settings.databaseFilePath,
      type: `sqlite`,
      database: path.join(this.settings.databaseFilePath, DB_FILE),
      synchronize: true,
      logging: false,
      dropSchema: this.settings.dropSchema,
      entities: this.entities,
    });
  }
}
