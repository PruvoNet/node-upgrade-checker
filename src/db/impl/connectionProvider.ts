import {Dependency} from '../entities/dependency';
import {inject, injectable} from 'inversify';
import {Connection} from 'typeorm/connection/Connection';
import {TypeOrm, TYPES} from '../types';
import {ConnectionProviderSettings} from './connectionProviderSettings';
import * as path from 'path';

const DB_FILE = 'cache.db';

@injectable()
export class ConnectionProvider {

    private connection?: Connection;

    constructor(private settings: ConnectionProviderSettings, @inject(TYPES.TypeOrm) private typeorm: TypeOrm) {
    }

    public async getConnection(): Promise<Connection> {
        if (this.connection) {
            return this.connection;
        }
        this.connection = await this.typeorm.createConnection({
            name: this.settings.databaseFilePath,
            type: 'sqlite',
            database: path.join(this.settings.databaseFilePath, DB_FILE),
            synchronize: true,
            logging: false,
            dropSchema: this.settings.dropSchema,
            entities: [
                Dependency,
            ],
        });
        return this.connection;
    }
}
