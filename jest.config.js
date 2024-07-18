module.exports = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
      "^.+\\.jsx?$": "babel-jest",
      "^.+\\.js$": "babel-jest",
    },
    moduleFileExtensions: ["js", "jsx"],
    testEnvironment: "jsdom",
    transformIgnorePatterns: ["/node_modules/(?!(axios)/)"],
    moduleNameMapper: {
      "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
      "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
    },
};  