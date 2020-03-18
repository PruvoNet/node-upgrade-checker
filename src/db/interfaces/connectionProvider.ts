import {injectable} from 'inversify';
import {Connection} from 'typeorm/connection/Connection';

@injectable()
export abstract class IConnectionProvider {

    public abstract async getConnection(): Promise<Connection>;
}
