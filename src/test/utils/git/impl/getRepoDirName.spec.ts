'use strict';

import {container} from '../../../../container';
import {IGetRepoDirName} from '../../../../utils/git';

const baseUrl = 'https://github.com/PruvoNet/squiss-ts';
const dirName = 'squiss-ts';

describe('getRepoDirName', () => {

    let getRepoDirName: IGetRepoDirName;

    beforeEach(() => {
        container.snapshot();
        getRepoDirName = container.get(IGetRepoDirName);
    });

    afterEach(() => {
        container.restore();
    });

    it('should git repo dir name with .git suffix', async () => {
        const name = await getRepoDirName.get({
            url: `${baseUrl}.git`,
        });
        name.should.eql(dirName);
    });

    it('should git repo dir name without .git suffix', async () => {
        const name = await getRepoDirName.get({
            url: `${baseUrl}`,
        });
        name.should.eql(dirName);
    });

    it('should git repo dir name with .git suffix uppercase', async () => {
        const name = await getRepoDirName.get({
            url: `${baseUrl}.git`.toUpperCase(),
        });
        name.should.eql(dirName);
    });

    it('should git repo dir name without .git suffix uppercase', async () => {
        const name = await getRepoDirName.get({
            url: `${baseUrl}`.toUpperCase(),
        });
        name.should.eql(dirName);
    });

});
