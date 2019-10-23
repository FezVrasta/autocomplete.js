/* eslint-disable import/no-commonjs */

module.exports = {
  rootDir: process.cwd(),
  testPathIgnorePatterns: ['node_modules/', 'dist/', '<rootDir>/examples/'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
