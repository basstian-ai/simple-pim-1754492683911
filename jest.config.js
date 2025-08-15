module.exports = {
  testEnvironment: 'node',
  verbose: true,
  testMatch: ["**/tests/**/*.test.[jt]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/audits/"],
};
