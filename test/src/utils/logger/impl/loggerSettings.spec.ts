import { LoggerSettings } from '../../../../../src/utils/logger';

describe(`logger settings`, () => {
  it(`should expose properties properly`, async () => {
    const settings = new LoggerSettings(true);
    expect(settings.debugMode).toBe(true);
  });

  it(`should expose properties properly 2`, async () => {
    const settings = new LoggerSettings(false);
    expect(settings.debugMode).toBe(false);
  });
});
