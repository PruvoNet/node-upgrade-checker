import {container} from '../../../../../src/container';
import {Dependency, IDependencyRepositoryProvider} from '../../../../../src/db';
import {Repository} from 'typeorm';
import {ICacheResolver} from '../../../../../src/resolvers/cacheResolver';
import Mock = jest.Mock;

describe('cache resolver', () => {

    let cacheResolver: ICacheResolver;
    let findOneStub: Mock;

    beforeEach(() => {
        container.snapshot();
        findOneStub = jest.fn();
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
        findOneStub.mockResolvedValue(dependency);
        const targetNode = '8';
        const result = await cacheResolver.resolve({
            repo: {
                version: dependency.version,
                name: dependency.name,
            },
            targetNode,
        });
        expect(findOneStub).toHaveBeenCalledWith({
            name: dependency.name,
            version: dependency.version,
            targetNode,
        });
        expect(result.isMatch).toBe(true);
        expect(result.resolverName).toBe('circleCi (cache)');
    });

    it('should not resolve if not in cache', async () => {
        const dependency = new Dependency({
            targetNode: '12',
            match: true,
            version: '4.0.1',
            name: 'test dependency',
            reason: 'circleCi',
        });
        findOneStub.mockResolvedValue(undefined);
        const targetNode = '8';
        const result = await cacheResolver.resolve({
            repo: {
                version: dependency.version,
                name: dependency.name,
            },
            targetNode,
        });
        expect(findOneStub).toHaveBeenCalledWith({
            name: dependency.name,
            version: dependency.version,
            targetNode,
        });
        expect(result.isMatch).toBe(false);
    });

    it('should not resolve if cache error', async () => {
        const dependency = new Dependency({
            targetNode: '12',
            match: true,
            version: '4.0.1',
            name: 'test dependency',
            reason: 'circleCi',
        });
        findOneStub.mockRejectedValue(new Error());
        const targetNode = '8';
        const result = await cacheResolver.resolve({
            repo: {
                version: dependency.version,
                name: dependency.name,
            },
            targetNode,
        });
        expect(findOneStub).toHaveBeenCalledWith({
            name: dependency.name,
            version: dependency.version,
            targetNode,
        });
        expect(result.isMatch).toBe(false);
    });

});
