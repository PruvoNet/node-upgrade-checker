import {IDependencyVersionRepositoryProvider, DependencyVersion} from '../../../../db';
import {container} from '../../../../container';
import {ConnectionProviderSettings} from '../../../../db/impl/connectionProviderSettings';
import * as tmp from 'tmp';
import {expect} from 'chai';

describe('db', () => {

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
        expect(repo).to.eq(repo2);
    });

    it('should save entity', async () => {
        const repo = await dependencyVersionRepositoryProvider.getRepository();
        const dependency = new DependencyVersion({
            semver: '^4.0.0',
            version: '4.0.1',
            name: 'test dependency',
            repoUrl: 'https://www.github.com/example/test.git',
            commitSha: 'sdf-sdf-sdf-sdf-wert-fdgf',
        });
        await repo.save(dependency);
        const count = await repo.count();
        count.should.eql(1);
        const entities = await repo.find();
        entities.length.should.eql(1);
        entities[0].should.deep.eq(dependency);
    });

    it('should save multiple entities', async () => {
        const repo = await dependencyVersionRepositoryProvider.getRepository();
        const dependency = new DependencyVersion({
            semver: '^4.0.0',
            version: '4.0.1',
            name: 'test dependency',
            repoUrl: 'https://www.github.com/example/test.git',
            commitSha: 'sdf-sdf-sdf-sdf-wert-fdgf',
        });
        const dependency2 = new DependencyVersion({
            semver: '^5.0.0',
            version: '5.0.1',
            name: 'test dependency2',
            repoUrl: 'https://www.github.com/example/test2.git',
            commitSha: 'sdf-sdf-sdf-sdf-wert-fdgf',
        });
        await repo.save([dependency, dependency2]);
        const count = await repo.count();
        count.should.eql(2);
        const entities = await repo.find();
        entities.length.should.eql(2);
        entities[0].should.deep.eq(dependency);
        entities[1].should.deep.eq(dependency2);
    });

    it('should have proper key', async () => {
        const repo = await dependencyVersionRepositoryProvider.getRepository();
        const dependency = new DependencyVersion({
            semver: '^4.0.1',
            version: '4.0.1',
            name: 'test dependency',
            repoUrl: 'https://www.github.com/example/test.git',
            commitSha: 'sdf-sdf-sdf-sdf-wert-fdgf',
        });
        const dependency2 = new DependencyVersion({
            semver: '^4.0.1',
            version: '4.0.0',
            name: 'test dependency',
            repoUrl: 'https://www.github.com/example/test2.git',
        });
        await repo.save(dependency);
        await repo.save(dependency2);
        const count = await repo.count();
        count.should.eql(1);
    });

    it('should find entities', async () => {
        const repo = await dependencyVersionRepositoryProvider.getRepository();
        const dependency = new DependencyVersion({
            semver: '^4.0.0',
            version: '4.0.1',
            name: 'test dependency',
            repoUrl: 'https://www.github.com/example/test.git',
            commitSha: 'sdf-sdf-sdf-sdf-wert-fdgf',
        });
        const dependency2 = new DependencyVersion({
            semver: '^5.0.0',
            version: '5.0.1',
            name: 'test dependency2',
            repoUrl: 'https://www.github.com/example/test2.git',
            commitSha: 'sdf-sdf-sdf-sdf-wert-fdgf',
        });
        await repo.save([dependency, dependency2]);
        const entity = await repo.findOne({
            version: '4.0.1',
        });
        expect(entity).to.not.eq(undefined);
        entity!.should.deep.eq(dependency);
    });

});
