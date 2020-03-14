import {Dependency, IDependencyRepositoryProvider} from '../../../../db';
import {container} from '../../../../container';
import {ConnectionProviderSettings} from '../../../../db/impl/connectionProviderSettings';
import * as tmp from 'tmp';
import { expect } from 'chai';

describe('db', () => {

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
        expect(repo).to.eq(repo2);
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
        count.should.eql(1);
        const entities = await repo.find();
        entities.length.should.eql(1);
        entities[0].should.deep.eq(dependency);
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
        count.should.eql(2);
        const entities = await repo.find();
        entities.length.should.eql(2);
        entities[0].should.deep.eq(dependency);
        entities[1].should.deep.eq(dependency2);
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
        expect(entity).to.not.eq(undefined);
        entity!.should.deep.eq(dependency);
    });

});
