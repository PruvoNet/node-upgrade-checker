import { container } from '../../../../src/container';
import * as tmp from 'tmp';
import { Connection } from 'typeorm';
import { IConnectionProvider, IConnectionSettings } from '../../../../src/db';

describe(`connection provider e2e`, () => {
  let connectionProvider: IConnectionProvider;

  beforeEach(() => {
    container.snapshot();
    const tmpDir = tmp.dirSync().name;
    container.bind<IConnectionSettings>(IConnectionSettings).toConstantValue({
      databaseFilePath: tmpDir,
      dropSchema: false,
    });
    connectionProvider = container.get(IConnectionProvider);
  });

  afterEach(() => {
    container.restore();
  });

  it(`should get connection`, async () => {
    const conn = await connectionProvider.getConnection();
    expect(conn).toBeInstanceOf(Connection);
  });
});
