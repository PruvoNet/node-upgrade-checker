import {Dependency, IDependencyRepositoryProvider} from '../../../../src/db';
import {container} from '../../../../src/container';
import {ConnectionProviderSettings} from '../../../../src/db/impl/connectionProviderSettings';
import * as tmp from 'tmp';

describe('dependency repository provider', () => {

    let dependencyRepositoryProvider: IDependencyRepositoryProvider;

    beforeEach(() => {
        container.snapshot();
        const tmpDir = tmp.dirSync().name;
        container.bind<ConnectionProviderSettings>(ConnectionProviderSettings).toConstantValue(
            new ConnectionProviderSettings(tmpDir, false));
        dependencyRepositoryProvider = container.get(IDependencyRepositoryProvider);
    });

    afterEach(() => {
        container.restore();
    });

    it('should cache repo', async () => {
        const repo = await dependencyRepositoryProvider.getRepository();
        const repo2 = await dependencyRepositoryProvider.getRepository();
        expect(repo).toEqual(repo2);
    });

    it('should save entity', async () => {
        const repo = await dependencyRepositoryProvider.getRepository();
        const dependency = new Dependency({
            targetNode: '12',
            match: true,
            version: '4.0.1',
            name: 'test dependency',
            reason: 'cache',
        });
        await repo.save(dependency);
        const count = await repo.count();
        expect(count).toBe(1);
        const entities = await repo.find();
        expect(entities.length).toBe(1);
        expect(entities[0]).toEqual(dependency);
    });

    it('should save multiple entities', async () => {
        const repo = await dependencyRepositoryProvider.getRepository();
        const dependency = new Dependency({
            targetNode: '12',
            match: true,
            version: '4.0.1',
            name: 'test dependency',
            reason: 'cache',
        });
        const dependency2 = new Dependency({
            targetNode: '13',
            match: true,
            version: '5.0.1',
            name: 'test dependency 2',
            reason: 'cache',
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
        const repo = await dependencyRepositoryProvider.getRepository();
        const dependency = new Dependency({
            targetNode: '12',
            match: true,
            version: '5.0.1',
            name: 'test dependency',
            reason: 'cache',
        });
        const dependency2 = new Dependency({
            targetNode: '12',
            match: false,
            version: '5.0.1',
            name: 'test dependency',
            reason: 'cache2',
        });
        await repo.save(dependency);
        await repo.save(dependency2);
        const count = await repo.count();
        expect(count).toBe(1);
    });

    it('should find entities', async () => {
        const repo = await dependencyRepositoryProvider.getRepository();
        const dependency = new Dependency({
            targetNode: '12',
            match: true,
            version: '4.0.1',
            name: 'test dependency',
            reason: 'cache',
        });
        const dependency2 = new Dependency({
            targetNode: '13',
            match: true,
            version: '5.0.1',
            name: 'test dependency 2',
            reason: 'cache',
        });
        await repo.save([dependency, dependency2]);
        const entity = await repo.findOne({
            version: '4.0.1',
        });
        expect(entity).toEqual(dependency);
    });

});
