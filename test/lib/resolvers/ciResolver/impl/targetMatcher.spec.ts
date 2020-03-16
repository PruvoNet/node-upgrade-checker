import {container} from '../../../../../src/container';
import {ITargetMatcher} from '../../../../../src/resolvers/ciResolver';

describe('target matcher', () => {

    let targetMatcher: ITargetMatcher;

    beforeEach(() => {
        container.snapshot();
        targetMatcher = container.get(ITargetMatcher);
    });

    afterEach(() => {
        container.restore();
    });


    it('should match target node from candidates', async () => {
        const result = await targetMatcher.match({
            candidates: ['6', '8', '10', '11'],
            targetNode: '8',
        });
        expect(result).toBe(true);
    });

    it('should match target node from complex candidates', async () => {
        const result = await targetMatcher.match({
            candidates: ['6', '8.14', '10', '11'],
            targetNode: '8',
        });
        expect(result).toBe(true);
    });

    it('should match target node from complex candidates 2', async () => {
        const result = await targetMatcher.match({
            candidates: ['6', '8.x', '10', '11'],
            targetNode: '8',
        });
        expect(result).toBe(true);
    });

    it('should not match target node from candidates', async () => {
        const result = await targetMatcher.match({
            candidates: ['6', '8.14', '10', '11'],
            targetNode: '4',
        });
        expect(result).toBe(false);
    });

});
