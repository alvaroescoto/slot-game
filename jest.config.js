module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // ✅ Required for DOM usage
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json' // ✅ TS config only for tests
    }]
  }
};
