const jestConfig = require('./jest.config.js');
jestConfig.testMatch = ['<rootDir>/test/**/*.spec.ts'];
const config = {
  mutator: { name: 'typescript' },
  packageManager: 'yarn',
  reporters: ['html', 'progress'],
  testFramework: 'jest',
  testRunner: 'jest',
  coverageAnalysis: 'off',
  tsconfigFile: 'tsconfig.json',
  mutate: ['src/**/*.ts'],
  dashboard: {
    reportType: 'full',
  },
  timeoutMs: 20000,
  maxConcurrentTestRunners: 4,
  thresholds: {
    high: 90,
    low: 70,
    break: 70,
  },
  jest: {
    projectType: 'custom',
    config: jestConfig,
    enableFindRelatedTests: true,
  },
};

if (process.env.JEST_CI) {
  config.maxConcurrentTestRunners = 1;
  config.reporters.push('dashboard', 'clear-text');
}

module.exports = config;
