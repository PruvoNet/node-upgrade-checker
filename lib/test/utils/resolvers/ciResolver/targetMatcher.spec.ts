import {targetMatcher} from '../../../../utils/resolvers/ciResolver/targetMatcher';

describe('target matcher', () => {

    it('should match target node from candidates', async () => {
        const result = await targetMatcher({
            candidates: ['6', '8', '10', '11'],
            targetNode: '8',
        });
        result.should.eql(true);
    });

    it('should match target node from complex candidates', async () => {
        const result = await targetMatcher({
            candidates: ['6', '8.14', '10', '11'],
            targetNode: '8',
        });
        result.should.eql(true);
    });

    it('should match target node from complex candidates 2', async () => {
        const result = await targetMatcher({
            candidates: ['6', '8.x', '10', '11'],
            targetNode: '8',
        });
        result.should.eql(true);
    });

    it('should not match target node from candidates', async () => {
        const result = await targetMatcher({
            candidates: ['6', '8.14', '10', '11'],
            targetNode: '4',
        });
        result.should.eql(false);
    });

});
