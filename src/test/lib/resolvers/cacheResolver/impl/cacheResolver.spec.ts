import {container} from '../../../../../container';
import {Dependency, IDependencyRepositoryProvider} from '../../../../../db';
import {Repository} from 'typeorm';
import * as sinon from 'sinon';
import {ICacheResolver} from '../../../../../resolvers/cacheResolver';
import {SinonStub} from 'sinon';

describe('cache resolver', () => {

    let cacheResolver: ICacheResolver;
    let findOneStub: SinonStub;

    beforeEach(() => {
        container.snapshot();
        findOneStub = sinon.stub();
        const repositorySpy = {
            findOne: findOneStub,
        } as any as Repository<Dependency>;
        const dependencyRepositoryProviderSpy: IDependencyRepositoryProvider = {
            async getRepository(): Promise<Repository<Dependency>> {
                return repositorySpy;
            },
        };
        container.unbind(IDependencyRepositoryProvider);
        container.bind<IDependencyRepositoryProvider>(IDependencyRepositoryProvider)
            .toConstantValue(dependencyRepositoryProviderSpy);
        cacheResolver = container.get(ICacheResolver);
    });

    afterEach(() => {
        container.restore();
    });

    it('should resolve if match in cache', async () => {
        const dependency = new Dependency({
            targetNode: '12',
            match: true,
            version: '4.0.1',
            name: 'test dependency',
            reason: 'circleCi',
        });
        findOneStub.resolves(dependency);
        const targetNode = '8';
        const result = await cacheResolver.resolve({
            repo: {
                version: dependency.version,
                name: dependency.name,
            },
            targetNode,
        });
        findOneStub.calledWith({
            name: dependency.name,
            version: dependency.version,
            targetNode,
        });
        result.isMatch.should.eql(true);
        result.resolverName!.should.eql('circleCi (cache)');
    });

    it('should not resolve if not in cache', async () => {
        const dependency = new Dependency({
            targetNode: '12',
            match: true,
            version: '4.0.1',
            name: 'test dependency',
            reason: 'circleCi',
        });
        findOneStub.resolves(undefined);
        const targetNode = '8';
        const result = await cacheResolver.resolve({
            repo: {
                version: dependency.version,
                name: dependency.name,
            },
            targetNode,
        });
        findOneStub.calledWith({
            name: dependency.name,
            version: dependency.version,
            targetNode,
        });
        result.isMatch.should.eql(false);
    });

    it('should not resolve if cache error', async () => {
        const dependency = new Dependency({
            targetNode: '12',
            match: true,
            version: '4.0.1',
            name: 'test dependency',
            reason: 'circleCi',
        });
        findOneStub.rejects(undefined);
        const targetNode = '8';
        const result = await cacheResolver.resolve({
            repo: {
                version: dependency.version,
                name: dependency.name,
            },
            targetNode,
        });
        findOneStub.calledWith({
            name: dependency.name,
            version: dependency.version,
            targetNode,
        });
        result.isMatch.should.eql(false);
    });

});
