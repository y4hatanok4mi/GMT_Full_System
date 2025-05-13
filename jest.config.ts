import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/auth$": "<rootDir>/auth",
    "^@/lib/(.*)$": "<rootDir>/lib/$1",
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/(.*)$": "<rootDir>/app/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest", // Use babel-jest to handle .ts/.tsx files
    "^.+\\.jsx?$": "babel-jest", // Transform .js and .jsx files with babel-jest
  },
  transformIgnorePatterns: [
    "/node_modules/(?!next-auth|@auth/core)/", // Allow transformation of `next-auth` and `@auth/core`
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
