import { LogLevel as ConsolaLogLevel } from 'consola';
import { getConoslaLogLevel } from '../../../../../src/utils/logger/impl/logLevel';
import { LogLevel } from '../../../../../src/utils/logger';

describe(`log level`, () => {
  describe(`get conosla log level`, () => {
    it(`Should have proper mappings`, () => {
      expect(getConoslaLogLevel(LogLevel.ERROR)).toEqual(ConsolaLogLevel.Error);
      expect(getConoslaLogLevel(LogLevel.WARN)).toEqual(ConsolaLogLevel.Warn);
      expect(getConoslaLogLevel(LogLevel.LOG)).toEqual(ConsolaLogLevel.Log);
      expect(getConoslaLogLevel(LogLevel.INFO)).toEqual(ConsolaLogLevel.Info);
      expect(getConoslaLogLevel(LogLevel.DEBUG)).toEqual(ConsolaLogLevel.Debug);
      expect(getConoslaLogLevel(LogLevel.TRACE)).toEqual(ConsolaLogLevel.Trace);
      expect(getConoslaLogLevel(LogLevel.SILENT)).toEqual(-ConsolaLogLevel.Silent);
    });
  });
});
