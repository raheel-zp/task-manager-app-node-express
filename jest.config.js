export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testPathIgnorePatterns: ["/node_modules/"],
  testTimeout: 20000,
};
