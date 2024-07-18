// jest.config.js
module.exports = {
    transform: {
      "^.+\\.jsx?$": "babel-jest",
    },
    moduleFileExtensions: ["js", "jsx"],
    testEnvironment: "jsdom",
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
    moduleNameMapper: {
      "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    },
};
  