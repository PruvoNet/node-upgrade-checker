import * as fs from 'fs';
import * as yaml from 'yaml';

export type FS = typeof fs;
export type Yaml = typeof yaml;
export const TYPES = {
    FS: Symbol.for('FS'),
    YAML: Symbol.for('YAML'),
};
