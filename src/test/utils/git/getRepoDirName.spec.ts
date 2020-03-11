'use strict';

import {getRepoDirName} from '../../../utils/git/getRepoDirName';

const baseUrl = 'https://github.com/PruvoNet/squiss-ts';
const dirName = 'squiss-ts';

describe('getRepoDirName', () => {

    it('should git repo dir name with .git suffix', async () => {
        const name = await getRepoDirName({
            url: `${baseUrl}.git`,
        });
        name.should.eql(dirName);
    });

    it('should git repo dir name without .git suffix', async () => {
        const name = await getRepoDirName({
            url: `${baseUrl}`,
        });
        name.should.eql(dirName);
    });

    it('should git repo dir name with .git suffix uppercase', async () => {
        const name = await getRepoDirName({
            url: `${baseUrl}.git`.toUpperCase(),
        });
        name.should.eql(dirName);
    });

    it('should git repo dir name without .git suffix uppercase', async () => {
        const name = await getRepoDirName({
            url: `${baseUrl}`.toUpperCase(),
        });
        name.should.eql(dirName);
    });

});
