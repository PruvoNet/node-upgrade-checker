import './utils/cli-setup';
import { container } from '../src/container';
import * as tmp from 'tmp';
import { IConnectionOptionsProvider, IConnectionSettings } from '../src/db';

const tmpDir = tmp.dirSync().name;
container.bind<IConnectionSettings>(IConnectionSettings).toConstantValue({
  databaseFilePath: tmpDir,
  migrationGenerationConfig: true,
});
const connectionOptionsProvider = container.get(IConnectionOptionsProvider);
module.exports = connectionOptionsProvider.getConnectionOptions();
