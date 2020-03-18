import {Dependency, IDependencyRepositoryProvider} from '../../../../../src/db';
import {Repository} from 'typeorm';
import Mock = jest.Mock;
import {CacheResolver} from '../../../../../src/resolvers/cacheResolver/impl/cacheResolver';

describe(`cache resolver`, () => {

    let cacheResolver: CacheResolver;
    let findOneStub: Mock;

    beforeEach(() => {
        findOneStub = jest.fn();
        const repositorySpy = {
            findOne: findOneStub,
        } as any as Repository<Dependency>;
        const dependencyRepositoryProviderSpy: IDependencyRepositoryProvider = {
            getRepository: async(): Promise<Repository<Dependency>> => {
                return repositorySpy;
            },
        };
        cacheResolver = new CacheResolver(dependencyRepositoryProviderSpy);
    });

    it(`should resolve if match in cache`, async () => {
        const dependency = new Dependency({
            targetNode: `12`,
            match: true,
            version: `4.0.1`,
            name: `test dependency`,
            reason: `circleCi`,
        });
        findOneStub.mockResolvedValue(dependency);
        const targetNode = `8`;
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
        expect(result.resolverName).toBe(`circleCi (cache)`);
    });

    it(`should not resolve if not in cache`, async () => {
        const dependency = new Dependency({
            targetNode: `12`,
            match: true,
            version: `4.0.1`,
            name: `test dependency`,
            reason: `circleCi`,
        });
        findOneStub.mockResolvedValue(undefined);
        const targetNode = `8`;
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

    it(`should not resolve if cache error`, async () => {
        const dependency = new Dependency({
            targetNode: `12`,
            match: true,
            version: `4.0.1`,
            name: `test dependency`,
            reason: `circleCi`,
        });
        findOneStub.mockRejectedValue(new Error());
        const targetNode = `8`;
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
