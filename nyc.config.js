'use strict';

const {parserPlugins} = require('@istanbuljs/schema').defaults.nyc;

module.exports = {
  cache: false,
  parserPlugins: parserPlugins.concat(['typescript']),
  sourceMap: false,
  'produce-source-map': false,
  exclude: [
    'src/test/**',
    'src/testE2e/**',
    'dist/**',
    'nyc.config.js'
  ],
  all: true
};
