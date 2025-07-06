module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // ✅ Use jsdom to support DOM APIs like document
  testMatch: ["**/tests/**/*.test.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.jest.json"
    }
  }
};
