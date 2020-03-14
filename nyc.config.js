'use strict';

module.exports = {
  cache: false,
  exclude: [
    'src/test/**',
    'src/testE2e/**',
    'dist/test/**',
    'dist/testE2e/**',
    'dist/**.ts',
    'nyc.config.js'
  ],
  all: false
};
