import {container} from '../../../../container';
import {ConnectionProviderSettings} from '../../../../db/impl/connectionProviderSettings';
import * as tmp from 'tmp';
import {expect} from 'chai';
import {ConnectionProvider} from '../../../../db/impl/connectionProvider';

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
        expect(conn).to.eq(conn2);
    });

});
