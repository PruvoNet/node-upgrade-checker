import { container } from '../../../../src/container';
import * as tmp from 'tmp';
import { Connection } from 'typeorm';
import { IConnectionProvider, IConnectionSettings } from '../../../../src/db';

describe(`connection provider integration`, () => {
  let connectionProvider: IConnectionProvider;
  let conn: Connection;

  beforeEach(async () => {
    container.snapshot();
    const tmpDir = tmp.dirSync().name;
    container.bind<IConnectionSettings>(IConnectionSettings).toConstantValue({
      databaseFilePath: tmpDir,
    });
    connectionProvider = container.get(IConnectionProvider);
    conn = await connectionProvider.getConnection();
  });

  afterEach(async () => {
    container.restore();
    await conn.close();
  });

  it(`should get connection`, async () => {
    expect(conn).toBeInstanceOf(Connection);
  });
});
