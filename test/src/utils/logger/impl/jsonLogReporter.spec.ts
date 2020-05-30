import { LogLevel } from 'consola';
import { getMockedStream } from '../../../../common/streams';
import { JsonLogReporter } from '../../../../../src/utils/logger/impl/jsonLogReporter';
import moment = require('moment');

describe(`json log reporter`, () => {
  it(`should log with tag`, async () => {
    const date = moment();
    const { mockedStream, streamPromise, closeStream } = getMockedStream();
    const logReporter = new JsonLogReporter({
      stream: mockedStream,
    });
    logReporter.log({
      level: LogLevel.Info,
      type: `info`,
      args: [`my`, `message`],
      date: date.toDate(),
      tag: `tag`,
    });
    closeStream();
    const result = await streamPromise;
    expect(JSON.parse(result)).toEqual({
      date: date.toJSON(),
      level: LogLevel.Info,
      message: `my message`,
      tag: `tag`,
      type: `info`,
    });
  });

  it(`should log without tag`, async () => {
    const date = moment();
    const { mockedStream, streamPromise, closeStream } = getMockedStream();
    const logReporter = new JsonLogReporter({
      stream: mockedStream,
    });
    logReporter.log({
      level: LogLevel.Info,
      type: `info`,
      args: [`my`, `message`],
      date: date.toDate(),
    });
    closeStream();
    const result = await streamPromise;
    expect(JSON.parse(result)).toEqual({
      date: date.toJSON(),
      level: LogLevel.Info,
      message: `my message`,
      type: `info`,
    });
  });

  it(`should log without args`, async () => {
    const date = moment();
    const { mockedStream, streamPromise, closeStream } = getMockedStream();
    const logReporter = new JsonLogReporter({
      stream: mockedStream,
    });
    logReporter.log({
      level: LogLevel.Info,
      type: `info`,
      date: date.toDate(),
    });
    closeStream();
    const result = await streamPromise;
    expect(JSON.parse(result)).toEqual({
      date: date.toJSON(),
      level: LogLevel.Info,
      message: ``,
      type: `info`,
    });
  });

  it(`should log with error`, async () => {
    const date = moment();
    const { mockedStream, streamPromise, closeStream } = getMockedStream();
    const logReporter = new JsonLogReporter({
      stream: mockedStream,
    });
    const err = new Error(`my error`);
    logReporter.log({
      level: LogLevel.Info,
      type: `info`,
      args: [`my`, `message`, err],
      date: date.toDate(),
      tag: `tag`,
    });
    closeStream();
    const result = await streamPromise;
    expect(JSON.parse(result)).toEqual({
      date: date.toJSON(),
      level: LogLevel.Info,
      message: expect.stringContaining(`my message my error\n  at Object`),
      type: `info`,
      tag: `tag`,
    });
  });
});
