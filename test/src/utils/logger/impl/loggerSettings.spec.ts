import { LoggerSettings } from '../../../../../src/utils/logger';

describe(`logger settings`, () => {
  it(`should expose properties properly`, async () => {
    const settings = new LoggerSettings(true, false);
    expect(settings.debugMode).toBe(true);
    expect(settings.traceMode).toBe(false);
  });

  it(`should expose properties properly 2`, async () => {
    const settings = new LoggerSettings(false, true);
    expect(settings.debugMode).toBe(false);
    expect(settings.traceMode).toBe(true);
  });
});
