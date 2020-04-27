import { LogReporter } from '../../../../../src/utils/logger/impl/logReporter';
import { PassThrough } from 'stream';
import * as chalk from 'chalk';
import * as figures from 'figures';

interface MockedStream {
  mockedStream: PassThrough;
  streamPromise: Promise<string>;
  closeStream: () => void;
}

const getMockedStream = (): MockedStream => {
  const mockedStream = new PassThrough();
  const streamPromise = new Promise<string>((resolve) => {
    const logData: Uint8Array[] = [];
    mockedStream.on(`data`, (data) => {
      logData.push(data);
    });
    mockedStream.on(`end`, () => {
      resolve(Buffer.concat(logData).toString());
    });
  });
  return {
    mockedStream,
    streamPromise,
    closeStream: (): void => {
      mockedStream.end();
      mockedStream.destroy();
    },
  };
};

describe(`log reporter`, () => {
  const logReporter = new LogReporter({
    secondaryColor: `grey`,
    bgColor: `bgGrey`,
  });

  it(`should log ERROR properly`, async () => {
    const { mockedStream, streamPromise, closeStream } = getMockedStream();
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
    closeStream();
    const result = await streamPromise;
    const expected = `
${chalk.bgRed.black(` ` + figures(`✖`) + ` `)} my message

`;
    expect(result).toBe(expected);
  });

  it(`should log WARN properly`, async () => {
    const { mockedStream, streamPromise, closeStream } = getMockedStream();
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
    closeStream();
    const result = await streamPromise;
    const expected = `
${chalk.bgYellow.black(` ` + figures(`Ⓘ`) + ` `)} my message

`;
    expect(result).toBe(expected);
  });

  it(`should log LOG properly`, async () => {
    const { mockedStream, streamPromise, closeStream } = getMockedStream();
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
    closeStream();
    const result = await streamPromise;
    const expected = `${chalk.bgWhite.black(` LOG `)} my message
`;
    expect(result).toBe(expected);
  });

  it(`should log INFO properly`, async () => {
    const { mockedStream, streamPromise, closeStream } = getMockedStream();
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
    closeStream();
    const result = await streamPromise;
    const expected = `${chalk.bgBlue.black(` ` + figures(`ℹ`) + ` `)} my message
`;
    expect(result).toBe(expected);
  });

  it(`should log DEBUG properly`, async () => {
    const { mockedStream, streamPromise, closeStream } = getMockedStream();
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
    closeStream();
    const result = await streamPromise;
    const expected = `${chalk.bgGrey.black(` DEBUG `)} my message
`;
    expect(result).toBe(expected);
  });

  it(`should log TRACE properly`, async () => {
    const { mockedStream, streamPromise, closeStream } = getMockedStream();
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
    closeStream();
    const result = await streamPromise;
    const expected = `${chalk.bgGrey.black(` TRACE `)} my message
`;
    expect(result).toBe(expected);
  });
});
