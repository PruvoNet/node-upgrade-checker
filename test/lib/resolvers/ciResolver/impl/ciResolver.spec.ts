import * as path from 'path';
import {ICIResolver} from '../../../../../src/resolvers/ciResolver';
import {resourcesDir} from '../../../../common';
import {container} from '../../../../../src/container';

describe('ci resolver', () => {

    let ciResolver: ICIResolver;

    beforeEach(() => {
        container.snapshot();
        ciResolver = container.get(ICIResolver);
    });

    afterEach(() => {
        container.restore();
    });

    it('should not resolve node js from repo with no ci', async () => {
        const repoPath = path.join(resourcesDir, 'empty');
        const result = await ciResolver.resolve({
            repoPath,
            targetNode: '2',
        });
        expect(result.isMatch).toBe(false);
    });

    describe('travis', () => {
        it('should resolve node js from travis configuration', async () => {
            const repoPath = path.join(resourcesDir, 'travis');
            const result = await ciResolver.resolve({
                repoPath,
                targetNode: '8',
            });
            expect(result.isMatch).toBe(true);
            expect(result.resolverName).toBe('travisCi');
        });

        it('should not resolve node js from travis configuration', async () => {
            const repoPath = path.join(resourcesDir, 'travis');
            const result = await ciResolver.resolve({
                repoPath,
                targetNode: '2',
            });
            expect(result.isMatch).toBe(false);
        });

        it('should not resolve node js from faulty travis configuration', async () => {
            const repoPath = path.join(resourcesDir, 'travisFaulty');
            const result = await ciResolver.resolve({
                repoPath,
                targetNode: '2',
            });
            expect(result.isMatch).toBe(false);
        });
    });

    describe('circleci', () => {
        it('should resolve node js from circleci configuration', async () => {
            const repoPath = path.join(resourcesDir, 'circleci');
            const result = await ciResolver.resolve({
                repoPath,
                targetNode: '10',
            });
            expect(result.isMatch).toBe(true);
            expect(result.resolverName).toBe('circleCi');
        });

        it('should not resolve node js from circleci configuration', async () => {
            const repoPath = path.join(resourcesDir, 'circleci');
            const result = await ciResolver.resolve({
                repoPath,
                targetNode: '2',
            });
            expect(result.isMatch).toBe(false);        });

        it('should not resolve node js from faulty circleci configuration', async () => {
            const repoPath = path.join(resourcesDir, 'circleciFaulty');
            const result = await ciResolver.resolve({
                repoPath,
                targetNode: '2',
            });
            expect(result.isMatch).toBe(false);        });

    });

    describe('github', () => {
        it('should resolve node js from github configuration', async () => {
            const repoPath = path.join(resourcesDir, 'github');
            const result = await ciResolver.resolve({
                repoPath,
                targetNode: '10',
            });
            expect(result.isMatch).toBe(true);
            expect(result.resolverName).toBe('githubActions');
        });

        it('should not resolve node js from github configuration', async () => {
            const repoPath = path.join(resourcesDir, 'github');
            const result = await ciResolver.resolve({
                repoPath,
                targetNode: '2',
            });
            expect(result.isMatch).toBe(false);        });

        it('should not resolve node js from faulty github configuration', async () => {
            const repoPath = path.join(resourcesDir, 'githubFaulty');
            const result = await ciResolver.resolve({
                repoPath,
                targetNode: '2',
            });
            expect(result.isMatch).toBe(false);        });
    });

});
