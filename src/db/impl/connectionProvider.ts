import {Dependency} from '../entities/dependency';
import {inject, injectable} from 'inversify';
import {Connection} from 'typeorm/connection/Connection';
import {TypeOrm, TYPES} from '../types';
import {ConnectionProviderSettings} from './connectionProviderSettings';


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
            type: 'sqlite',
            database: this.settings.databaseFile,
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
