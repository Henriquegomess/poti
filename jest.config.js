module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  rootDir: "./",
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.tsx?$",
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
  coverageDirectory: "coverage",
};
