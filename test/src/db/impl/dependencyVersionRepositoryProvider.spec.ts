import {IDependencyVersionRepositoryProvider, DependencyVersion} from '../../../../src/db';
import {container} from '../../../../src/container';
import {ConnectionProviderSettings} from '../../../../src/db/impl/connectionProviderSettings';
import * as tmp from 'tmp';

import moment = require('moment');

const dateFormat = `YYYY-MM-DD`;
const releaseDate = moment.utc('2015-10-02', dateFormat);

describe('dependency version repository provider', () => {

    let dependencyVersionRepositoryProvider: IDependencyVersionRepositoryProvider;

    beforeEach(() => {
        container.snapshot();
        const tmpDir = tmp.dirSync().name;
        container.bind<ConnectionProviderSettings>(ConnectionProviderSettings).toConstantValue(
            new ConnectionProviderSettings(tmpDir, false));
        dependencyVersionRepositoryProvider = container.get(IDependencyVersionRepositoryProvider);
    });

    afterEach(() => {
        container.restore();
    });

    it('should cache repo', async () => {
        const repo = await dependencyVersionRepositoryProvider.getRepository();
        const repo2 = await dependencyVersionRepositoryProvider.getRepository();
        expect(repo).toEqual(repo2);
    });

    it('should save entity', async () => {
        const repo = await dependencyVersionRepositoryProvider.getRepository();
        const dependency = new DependencyVersion({
            version: '4.0.1',
            name: 'test dependency',
            repoUrl: 'https://www.github.com/example/test.git',
            commitSha: 'sdf-sdf-sdf-sdf-wert-fdgf',
            releaseDate,
        });
        await repo.save(dependency);
        const count = await repo.count();
        expect(count).toBe(1);
        const entities = await repo.find();
        expect(entities.length).toBe(1);
        expect(entities[0]).toEqual(dependency);
    });

    it('should save multiple entities', async () => {
        const repo = await dependencyVersionRepositoryProvider.getRepository();
        const dependency = new DependencyVersion({
            version: '4.0.1',
            name: 'test dependency',
            repoUrl: 'https://www.github.com/example/test.git',
            commitSha: 'sdf-sdf-sdf-sdf-wert-fdgf',
            releaseDate,
        });
        const dependency2 = new DependencyVersion({
            version: '5.0.1',
            name: 'test dependency2',
            repoUrl: 'https://www.github.com/example/test2.git',
            commitSha: 'sdf-sdf-sdf-sdf-wert-fdgf',
            releaseDate,
        });
        await repo.save([dependency, dependency2]);
        const count = await repo.count();
        expect(count).toBe(2);
        const entities = await repo.find();
        expect(entities.length).toBe(2);
        expect(entities[0]).toEqual(dependency);
        expect(entities[1]).toEqual(dependency2);
    });

    it('should have proper key', async () => {
        const repo = await dependencyVersionRepositoryProvider.getRepository();
        const dependency = new DependencyVersion({
            version: '4.0.1',
            name: 'test dependency',
            repoUrl: 'https://www.github.com/example/test.git',
            commitSha: 'sdf-sdf-sdf-sdf-wert-fdgf',
            releaseDate,
        });
        const dependency2 = new DependencyVersion({
            version: '4.0.1',
            name: 'test dependency',
            repoUrl: 'https://www.github.com/example/test2.git',
            releaseDate,
            commitSha: 'sdf-sdf-sdf-sdf-wert-fdgf',
        });
        await repo.save(dependency);
        await repo.save(dependency2);
        const count = await repo.count();
        expect(count).toBe(1);
    });

    it('should find entities', async () => {
        const repo = await dependencyVersionRepositoryProvider.getRepository();
        const dependency = new DependencyVersion({
            version: '4.0.1',
            name: 'test dependency',
            repoUrl: 'https://www.github.com/example/test.git',
            commitSha: 'sdf-sdf-sdf-sdf-wert-fdgf',
            releaseDate,
        });
        const dependency2 = new DependencyVersion({
            version: '5.0.1',
            name: 'test dependency2',
            repoUrl: 'https://www.github.com/example/test2.git',
            commitSha: 'sdf-sdf-sdf-sdf-wert-fdgf',
            releaseDate,
        });
        await repo.save([dependency, dependency2]);
        const entity = await repo.findOne({
            version: '4.0.1',
        });
        expect(entity).toEqual(dependency);
    });

});
