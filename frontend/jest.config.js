module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^.+\\.(jpg|jpeg|png)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(svg)$": "<rootDir>/__mocks__/svgMock.js",
  },
  testMatch: ["**/?(*.)+(test).[tj]s?(x)"],
};