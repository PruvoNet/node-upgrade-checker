import { IConnectionOptionsProvider } from '../../../../src/db';
import { ConnectionProvider } from '../../../../src/db/impl/connectionProvider';
import { TypeOrm } from '../../../../src/container/nodeModulesContainer';
import { loggerFactory } from '../../../common/logger';
import { mock, mockClear, mockDeep, mockReset } from 'jest-mock-extended';
import { Connection, ConnectionOptions } from 'typeorm';
import { SchemaBuilder } from 'typeorm/schema-builder/SchemaBuilder';

describe(`connection provider`, () => {
  const connectionOptionsPlaceholder: ConnectionOptions = {
    type: `sqlite`,
    database: `database`,
  };
  const connectionOptionsProviderMock = mock<IConnectionOptionsProvider>();
  // @ts-ignore
  connectionOptionsProviderMock.getConnectionOptions.mockReturnValue(connectionOptionsPlaceholder);
  const connectionMock = mockDeep<Connection>();
  const typeOrmMock = mock<TypeOrm>();
  const schemaBuilderMock = mock<SchemaBuilder>();
  // @ts-ignore
  typeOrmMock.createConnection.mockResolvedValue(connectionMock);
  connectionMock.driver.createSchemaBuilder.mockReturnValue(schemaBuilderMock);

  beforeEach(() => {
    mockReset(schemaBuilderMock);
    mockClear(typeOrmMock);
  });

  it(`should call createConnection properly`, async () => {
    schemaBuilderMock.log.mockResolvedValue({
      upQueries: [],
      downQueries: [],
    });
    const connectionProvider = new ConnectionProvider(typeOrmMock, connectionOptionsProviderMock, loggerFactory);
    const conn = await connectionProvider.getConnection();
    expect(conn).toBe(connectionMock);
    expect(typeOrmMock.createConnection).toBeCalledTimes(1);
    expect(typeOrmMock.createConnection).toHaveBeenCalledWith(connectionOptionsPlaceholder);
  });

  it(`should fail it out of sync`, async () => {
    schemaBuilderMock.log.mockResolvedValue({
      upQueries: [
        {
          query: `query`,
        },
      ],
      downQueries: [],
    });
    const connectionProvider = new ConnectionProvider(typeOrmMock, connectionOptionsProviderMock, loggerFactory);
    const promise = connectionProvider.getConnection();
    await expect(promise).rejects.toBeInstanceOf(Error);
    await expect(promise).rejects.toMatchObject({
      message: expect.stringContaining(`DB schema is out of sync`),
    });
  });

  it(`should cache connection`, async () => {
    schemaBuilderMock.log.mockResolvedValue({
      upQueries: [],
      downQueries: [],
    });
    const connectionProvider = new ConnectionProvider(typeOrmMock, connectionOptionsProviderMock, loggerFactory);
    const conn = await connectionProvider.getConnection();
    const conn2 = await connectionProvider.getConnection();
    expect(conn).toBe(conn2);
    expect(conn).toBe(connectionMock);
    expect(typeOrmMock.createConnection).toBeCalledTimes(1);
  });
});
