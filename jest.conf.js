const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '.'),
  moduleFileExtensions: [
    'js',
    'json'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.js?$': '<rootDir>/node_modules/babel-jest'
  },
  testMatch: ['<rootDir>/__tests__/**/*.test.js']
}
