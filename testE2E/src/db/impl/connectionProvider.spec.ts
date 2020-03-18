import {container} from '../../../../src/container';
import {ConnectionProviderSettings} from '../../../../src/db/impl/connectionProviderSettings';
import * as tmp from 'tmp';
import {Connection} from 'typeorm';
import {IConnectionProvider} from '../../../../src/db';

describe('connection provider e2e', () => {

    let connectionProvider: IConnectionProvider;

    beforeEach(() => {
        container.snapshot();
        const tmpDir = tmp.dirSync().name;
        container.bind<ConnectionProviderSettings>(ConnectionProviderSettings).toConstantValue(
            new ConnectionProviderSettings(tmpDir, false));
        connectionProvider = container.get(IConnectionProvider);
    });

    afterEach(() => {
        container.restore();
    });

    it('should get connection', async () => {
        const conn = await connectionProvider.getConnection();
        expect(conn).toBeInstanceOf(Connection);
    });

});
