import { PassThrough } from 'stream';

export interface MockedStream {
  mockedStream: PassThrough;
  streamPromise: Promise<string>;
  closeStream: () => void;
}

export const getMockedStream = (): MockedStream => {
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
