import { LogReporter } from '../../../../../src/utils/logger/impl/logReporter';
import * as chalk from 'chalk';
import * as figures from 'figures';
import { LogLevel } from 'consola';
import { getMockedStream } from '../../../../common/streams';

describe(`log reporter`, () => {
  const logReporter = new LogReporter({
    secondaryColor: `grey`,
    bgColor: `bgGrey`,
    level: LogLevel.Trace,
  });

  it(`should not log using custom log level`, async () => {
    const infoLogReporter = new LogReporter({
      secondaryColor: `grey`,
      bgColor: `bgGrey`,
      level: LogLevel.Info,
    });
    const { mockedStream, streamPromise, closeStream } = getMockedStream();
    infoLogReporter.log(
      {
        level: LogLevel.Debug,
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
    expect(result).toBe(``);
  });

  it(`should log ERROR properly`, async () => {
    const { mockedStream, streamPromise, closeStream } = getMockedStream();
    logReporter.log(
      {
        level: LogLevel.Error,
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
        level: LogLevel.Warn,
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
        level: LogLevel.Log,
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
        level: LogLevel.Info,
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
        level: LogLevel.Debug,
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
        level: LogLevel.Trace,
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
