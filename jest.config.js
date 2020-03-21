const config = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
    },
  },
  testEnvironment: 'node',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/**/*.d.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 83,
      functions: 83,
      lines: 83,
      statements: 83,
    },
  },
  errorOnDeprecated: true,
  verbose: false,
  cacheDirectory: '<rootDir>/.cache',
};

if (process.env.JEST_CI) {
  config.runner = 'jest-serial-runner';
}

module.exports = config;
