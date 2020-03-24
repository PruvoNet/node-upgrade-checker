import * as path from 'path';
import { Dependency, DependencyVersion, IConnectionSettings } from '../../../../src/db';
import * as tmp from 'tmp';
import { ConnectionProvider } from '../../../../src/db/impl/connectionProvider';
import { TypeOrm } from '../../../../src/container/nodeModulesContainer';
import { loggerFactory } from '../../../common/logger';
import { mock, mockClear } from 'jest-mock-extended';
import { Connection } from 'typeorm';

describe(`connection provider`, () => {
  let tmpDir: string;
  const connectionMock = mock<Connection>();
  const typeOrmMock = mock<TypeOrm>();
  typeOrmMock.createConnection.mockResolvedValue(connectionMock);

  beforeEach(() => {
    tmpDir = tmp.dirSync().name;
    mockClear(typeOrmMock);
  });

  it(`should call createConnection properly`, async () => {
    const settings: IConnectionSettings = {
      databaseFilePath: tmpDir,
      dropSchema: false,
    };
    const connectionProvider = new ConnectionProvider(settings, typeOrmMock, [Dependency], loggerFactory);
    const conn = await connectionProvider.getConnection();
    expect(conn).toBe(connectionMock);
    expect(typeOrmMock.createConnection).toBeCalledTimes(1);
    expect(typeOrmMock.createConnection).toHaveBeenCalledWith({
      name: tmpDir,
      type: `sqlite`,
      database: path.join(tmpDir, `cache.db`),
      synchronize: true,
      logging: false,
      dropSchema: false,
      entities: [Dependency],
    });
  });

  it(`should call createConnection properly with drop schema`, async () => {
    const settings: IConnectionSettings = {
      databaseFilePath: tmpDir,
      dropSchema: true,
    };
    const connectionProvider = new ConnectionProvider(settings, typeOrmMock, [DependencyVersion], loggerFactory);
    const conn = await connectionProvider.getConnection();
    expect(conn).toBe(connectionMock);
    expect(typeOrmMock.createConnection).toBeCalledTimes(1);
    expect(typeOrmMock.createConnection).toHaveBeenCalledWith({
      name: tmpDir,
      type: `sqlite`,
      database: path.join(tmpDir, `cache.db`),
      synchronize: true,
      logging: false,
      dropSchema: true,
      entities: [DependencyVersion],
    });
  });

  it(`should cache connection`, async () => {
    const settings: IConnectionSettings = {
      databaseFilePath: tmpDir,
      dropSchema: false,
    };
    const connectionProvider = new ConnectionProvider(settings, typeOrmMock, [], loggerFactory);
    const conn = await connectionProvider.getConnection();
    const conn2 = await connectionProvider.getConnection();
    expect(conn).toBe(conn2);
    expect(conn).toBe(connectionMock);
    expect(typeOrmMock.createConnection).toBeCalledTimes(1);
  });
});
