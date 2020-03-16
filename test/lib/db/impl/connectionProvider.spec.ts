import {container} from '../../../../src/container';
import {ConnectionProviderSettings} from '../../../../src/db/impl/connectionProviderSettings';
import * as tmp from 'tmp';
import {ConnectionProvider} from '../../../../src/db/impl/connectionProvider';

describe('db', () => {

    let connectionProvider: ConnectionProvider;

    beforeEach(() => {
        container.snapshot();
        const tmpDir = tmp.dirSync().name;
        container.bind<ConnectionProviderSettings>(ConnectionProviderSettings).toConstantValue(
            new ConnectionProviderSettings(tmpDir, false));
        connectionProvider = container.get(ConnectionProvider);
    });

    afterEach(() => {
        container.restore();
    });

    it('should cache connection', async () => {
        const conn = await connectionProvider.getConnection();
        const conn2 = await connectionProvider.getConnection();
        expect(conn).toBe(conn2);
    });

});
