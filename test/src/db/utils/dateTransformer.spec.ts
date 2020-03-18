import {buildDateTransformer} from '../../../../src/db/utils/dateTransformer';
import moment = require('moment');

describe(`date transformer`, () => {
    it(`should transform dates properly`, async () => {
        const dateFormat = `YYYY-MM-DD`;
        const transformer = buildDateTransformer(dateFormat);
        const momentDate = moment.utc(`Tue 17 Mar 2020 23:22:23 z`);
        const expectedStr = `2020-03-17`;
        const expectedMoment = moment.utc(`Tue 17 Mar 2020 00:00:00 z`);
        expect(transformer.to(momentDate)).toBe(expectedStr);
        expect(transformer.from(expectedStr).toJSON()).toEqual(expectedMoment.toJSON());
    });

    it(`should transform dates properly 2`, async () => {
        const dateFormat = `YYYY-MM`;
        const transformer = buildDateTransformer(dateFormat);
        const momentDate = moment.utc(`Tue 17 Mar 2020 23:22:23 z`);
        const expectedStr = `2020-03`;
        const expectedMoment = moment.utc(`Sun 01 Mar 2020 00:00:00 z`);
        expect(transformer.to(momentDate)).toBe(expectedStr);
        expect(transformer.from(expectedStr).toJSON()).toEqual(expectedMoment.toJSON());
    });
});
