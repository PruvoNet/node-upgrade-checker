import * as child_process from 'child_process';

export type ChildProcess = typeof child_process;
export const TYPES = {
    ChildProcess: Symbol.for('ChildProcess'),
};
