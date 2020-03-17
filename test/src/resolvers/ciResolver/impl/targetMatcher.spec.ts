import {container} from '../../../../../src/container';
import {ITargetMatcher} from '../../../../../src/resolvers/ciResolver';
import moment = require('moment');
import Mock = jest.Mock;
import {ILts} from '../../../../../src/utils/lts';

const dateFormat = `YYYY-MM-DD`;
const packageReleaseDate = moment.utc('2015-10-02', dateFormat);

describe('target matcher', () => {

    let targetMatcher: ITargetMatcher;
    let resolveLtsVersionMock: Mock;

    beforeEach(() => {
        container.snapshot();
        resolveLtsVersionMock = jest.fn();
        const ltsMock  = {
            resolveLtsVersion: resolveLtsVersionMock,
        } as any as ILts;
        container.unbind(ILts);
        container.bind<ILts>(ILts)
            .toConstantValue(ltsMock);
        targetMatcher = container.get(ITargetMatcher);
    });

    afterEach(() => {
        container.restore();
    });

    it('should match target node from candidates', async () => {
        const result = await targetMatcher.match({
            candidates: ['6', '8', '10', '11'],
            targetNode: '8',
            packageReleaseDate,
        });
        expect(result).toBe(true);
    });

    it('should match target node from candidates while resolving lts', async () => {
        resolveLtsVersionMock.mockResolvedValue(['4', '6']);
        const result = await targetMatcher.match({
            candidates: ['LTS_VERSION', '8', '10', '11'],
            targetNode: '6',
            packageReleaseDate,
        });
        expect(result).toBe(true);
    });

    it('should match target node from complex candidates', async () => {
        const result = await targetMatcher.match({
            candidates: ['6', '8.14', '10', '11'],
            targetNode: '8',
            packageReleaseDate,
        });
        expect(result).toBe(true);
    });

    it('should match target node from complex candidates 2', async () => {
        const result = await targetMatcher.match({
            candidates: ['6', '8.x', '10', '11'],
            targetNode: '8',
            packageReleaseDate,
        });
        expect(result).toBe(true);
    });

    it('should not match target node from candidates', async () => {
        const result = await targetMatcher.match({
            candidates: ['6', '8.14', '10', '11'],
            targetNode: '4',
            packageReleaseDate,
        });
        expect(result).toBe(false);
    });

});
