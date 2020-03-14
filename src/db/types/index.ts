import * as typeorm from 'typeorm';

export type TypeOrm = typeof typeorm;
export const TYPES = {
    TypeOrm: Symbol.for('TypeOrm'),
};
