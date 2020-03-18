import {ConnectionProviderSettings} from '../../../../src/db/impl/connectionProviderSettings';
import {ConnectionProvider} from '../../../../src/db/impl/connectionProvider';
import Mock = jest.Mock;
import {TypeOrm} from '../../../../src/db/types';
import * as path from 'path';
import {Dependency, DependencyVersion} from '../../../../src/db';
import * as tmp from 'tmp';


describe('connection provider settings', () => {

    const placeholder = 'PLACEHOLDER';

    let tmpDir: string;
    let settings: ConnectionProviderSettings;
    let createConnectionMock: Mock;
    let typeOrmSpy: TypeOrm;

    beforeEach(() => {
        tmpDir = tmp.dirSync().name;
        createConnectionMock = jest.fn();
        createConnectionMock.mockResolvedValue(placeholder);
        typeOrmSpy = {
            createConnection: createConnectionMock,
        } as any as TypeOrm;
    });

    it('should call createConnection properly', async () => {
        settings = new ConnectionProviderSettings(tmpDir, false);
        const connectionProvider = new ConnectionProvider(settings, typeOrmSpy);
        const conn = await connectionProvider.getConnection();
        expect(conn).toBe(placeholder);
        expect(createConnectionMock).toBeCalledTimes(1);
        expect(createConnectionMock).toHaveBeenCalledWith({
            name: tmpDir,
            type: 'sqlite',
            database: path.join(tmpDir, 'cache.db'),
            synchronize: true,
            logging: false,
            dropSchema: false,
            entities: [
                Dependency,
                DependencyVersion,
            ],
        });
    });

    it('should call createConnection properly with drop schema', async () => {
        settings = new ConnectionProviderSettings(tmpDir, true);
        const connectionProvider = new ConnectionProvider(settings, typeOrmSpy);
        const conn = await connectionProvider.getConnection();
        expect(conn).toBe(placeholder);
        expect(createConnectionMock).toBeCalledTimes(1);
        expect(createConnectionMock).toHaveBeenCalledWith({
            name: tmpDir,
            type: 'sqlite',
            database: path.join(tmpDir, 'cache.db'),
            synchronize: true,
            logging: false,
            dropSchema: true,
            entities: [
                Dependency,
                DependencyVersion,
            ],
        });
    });

    it('should cache connection', async () => {
        settings = new ConnectionProviderSettings(tmpDir, false);
        const connectionProvider = new ConnectionProvider(settings, typeOrmSpy);
        const conn = await connectionProvider.getConnection();
        const conn2 = await connectionProvider.getConnection();
        expect(conn).toBe(conn2);
        expect(conn).toBe(placeholder);
        expect(createConnectionMock).toBeCalledTimes(1);
    });

});
