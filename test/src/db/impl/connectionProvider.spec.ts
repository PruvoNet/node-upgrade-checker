import Mock = jest.Mock;
import * as path from 'path';
import {Dependency, DependencyVersion, IConnectionSettings} from '../../../../src/db';
import * as tmp from 'tmp';
import {ConnectionProvider} from '../../../../src/db/impl/connectionProvider';
import {TypeOrm} from '../../../../src/container/nodeModulesContainer';

describe('connection provider', () => {

    const placeholder = 'PLACEHOLDER';

    let tmpDir: string;

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
        const settings: IConnectionSettings = {
            databaseFilePath: tmpDir,
            dropSchema: false,
        };
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
        const settings: IConnectionSettings = {
            databaseFilePath: tmpDir,
            dropSchema: true,
        };
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
        const settings: IConnectionSettings = {
            databaseFilePath: tmpDir,
            dropSchema: false,
        };
        const connectionProvider = new ConnectionProvider(settings, typeOrmSpy);
        const conn = await connectionProvider.getConnection();
        const conn2 = await connectionProvider.getConnection();
        expect(conn).toBe(conn2);
        expect(conn).toBe(placeholder);
        expect(createConnectionMock).toBeCalledTimes(1);
    });

});
