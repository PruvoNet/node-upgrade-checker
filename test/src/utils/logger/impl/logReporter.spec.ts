import { LogReporter } from '../../../../../src/utils/logger/impl/logReporter';
import { PassThrough } from 'stream';

describe(`log reporter`, () => {
  const logReporter = new LogReporter({
    secondaryColor: `grey`,
  });

  it(`should log ERROR properly`, async () => {
    const mockedStream = new PassThrough();
    const streamPromise = new Promise((resolve) => {
      const logData: Uint8Array[] = [];
      mockedStream.on(`data`, (data) => {
        logData.push(data);
      });
      mockedStream.on(`end`, () => {
        resolve(Buffer.concat(logData).toString());
      });
    });
    logReporter.log(
      {
        level: 0,
        type: `error`,
        args: [`my message`],
      },
      {
        async: false,
        stderr: mockedStream,
        stdout: mockedStream,
      }
    );
    mockedStream.end();
    mockedStream.destroy();
    const result = await streamPromise;
    expect(result).toBe(`
[41m[30m ERROR [39m[49m my message

`);
  });

  it(`should log WARN properly`, async () => {
    const mockedStream = new PassThrough();
    const streamPromise = new Promise((resolve) => {
      const logData: Uint8Array[] = [];
      mockedStream.on(`data`, (data) => {
        logData.push(data);
      });
      mockedStream.on(`end`, () => {
        resolve(Buffer.concat(logData).toString());
      });
    });
    logReporter.log(
      {
        level: 1,
        type: `warn`,
        args: [`my message`],
      },
      {
        async: false,
        stderr: mockedStream,
        stdout: mockedStream,
      }
    );
    mockedStream.end();
    mockedStream.destroy();
    const result = await streamPromise;
    expect(result).toBe(`
[43m[30m WARN [39m[49m my message

`);
  });

  it(`should log LOG properly`, async () => {
    const mockedStream = new PassThrough();
    const streamPromise = new Promise((resolve) => {
      const logData: Uint8Array[] = [];
      mockedStream.on(`data`, (data) => {
        logData.push(data);
      });
      mockedStream.on(`end`, () => {
        resolve(Buffer.concat(logData).toString());
      });
    });
    logReporter.log(
      {
        level: 2,
        type: `log`,
        args: [`my message`],
      },
      {
        async: false,
        stderr: mockedStream,
        stdout: mockedStream,
      }
    );
    mockedStream.end();
    mockedStream.destroy();
    const result = await streamPromise;
    expect(result).toBe(`[47m[30m LOG [39m[49m my message
`);
  });

  it(`should log INFO properly`, async () => {
    const mockedStream = new PassThrough();
    const streamPromise = new Promise((resolve) => {
      const logData: Uint8Array[] = [];
      mockedStream.on(`data`, (data) => {
        logData.push(data);
      });
      mockedStream.on(`end`, () => {
        resolve(Buffer.concat(logData).toString());
      });
    });
    logReporter.log(
      {
        level: 3,
        type: `info`,
        args: [`my message`],
      },
      {
        async: false,
        stderr: mockedStream,
        stdout: mockedStream,
      }
    );
    mockedStream.end();
    mockedStream.destroy();
    const result = await streamPromise;
    expect(result).toBe(`[42m[30m INFO [39m[49m my message
`);
  });

  it(`should log DEBUG properly`, async () => {
    const mockedStream = new PassThrough();
    const streamPromise = new Promise((resolve) => {
      const logData: Uint8Array[] = [];
      mockedStream.on(`data`, (data) => {
        logData.push(data);
      });
      mockedStream.on(`end`, () => {
        resolve(Buffer.concat(logData).toString());
      });
    });
    logReporter.log(
      {
        level: 4,
        type: `debug`,
        args: [`my message`],
      },
      {
        async: false,
        stderr: mockedStream,
        stdout: mockedStream,
      }
    );
    mockedStream.end();
    mockedStream.destroy();
    const result = await streamPromise;
    expect(result).toBe(`[100m[30m DEBUG [39m[49m my message
`);
  });

  it(`should log TRACE properly`, async () => {
    const mockedStream = new PassThrough();
    const streamPromise = new Promise((resolve) => {
      const logData: Uint8Array[] = [];
      mockedStream.on(`data`, (data) => {
        logData.push(data);
      });
      mockedStream.on(`end`, () => {
        resolve(Buffer.concat(logData).toString());
      });
    });
    logReporter.log(
      {
        level: 5,
        type: `trace`,
        args: [`my message`],
      },
      {
        async: false,
        stderr: mockedStream,
        stdout: mockedStream,
      }
    );
    mockedStream.end();
    mockedStream.destroy();
    const result = await streamPromise;
    expect(result).toBe(`[100m[30m TRACE [39m[49m my message
`);
  });
});
