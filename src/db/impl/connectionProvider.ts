import {Dependency} from '../entities/dependency';
import {inject, injectable} from 'inversify';
import {Connection} from 'typeorm/connection/Connection';
import {TypeOrm, TYPES} from '../types';
import {ConnectionProviderSettings} from './connectionProviderSettings';
import * as path from 'path';
import {DependencyVersion} from '../entities/dependencyVersion';
import {memoize} from '../../utils/memoize/memoize';
import {IConnectionProvider} from '../interfaces/connectionProvider';

const DB_FILE = 'cache.db';

@injectable()
export class ConnectionProvider extends IConnectionProvider{

    constructor(private settings: ConnectionProviderSettings, @inject(TYPES.TypeOrm) private typeorm: TypeOrm) {
        super();
    }

    @memoize()
    public async getConnection(): Promise<Connection> {
        return await this.typeorm.createConnection({
            name: this.settings.databaseFilePath,
            type: 'sqlite',
            database: path.join(this.settings.databaseFilePath, DB_FILE),
            synchronize: true,
            logging: false,
            dropSchema: this.settings.dropSchema,
            entities: [
                Dependency,
                DependencyVersion,
            ],
        });
    }
}
