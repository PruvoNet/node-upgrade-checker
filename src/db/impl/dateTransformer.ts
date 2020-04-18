import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer';
import { Moment } from 'moment';
import moment = require('moment');

export const buildDateTransformer = (dateFormat: string): ValueTransformer => {
  return {
    to: (value: Moment | null): string | null => {
      if (!value) {
        return null;
      }
      return value.format(dateFormat);
    },
    from: (value: string | null): Moment | null => {
      if (!value) {
        return null;
      }
      return moment.utc(value, dateFormat);
    },
  };
};
