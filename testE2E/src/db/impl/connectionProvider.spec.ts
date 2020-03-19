import { container } from '../../../../src/container';
import * as tmp from 'tmp';
import { Connection } from 'typeorm';
import { ConnectionSettings, IConnectionProvider, IConnectionSettings } from '../../../../src/db';

describe(`connection provider e2e`, () => {
  let connectionProvider: IConnectionProvider;

  beforeEach(() => {
    container.snapshot();
    const tmpDir = tmp.dirSync().name;
    container.bind<IConnectionSettings>(IConnectionSettings).toConstantValue(new ConnectionSettings(tmpDir, false));
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
