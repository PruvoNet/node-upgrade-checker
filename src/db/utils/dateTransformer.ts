import {ValueTransformer} from 'typeorm/decorator/options/ValueTransformer';
import {Moment} from 'moment';
// eslint-disable-next-line @typescript-eslint/quotes
import moment = require('moment');

export const buildDateTransformer = (dateFormat: string): ValueTransformer => {
    return {
        to: (value: Moment): string => {
            return value.format(dateFormat);
        },
        from: (value: string): Moment => {
            return moment.utc(value, dateFormat);
        },
    };
};
