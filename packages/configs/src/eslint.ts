import { ESLint } from "eslint";

const config: ESLint.ConfigData = {
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest" },
  plugins: ["@typescript-eslint", "jsx-a11y"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  env: { node: true },
  rules: {
    "prettier/prettier": [
      "error",
      {
        arrowParens: "avoid",
        bracketSameLine: true,
        htmlWhitespaceSensitivity: "css",
        proseWrap: "always",
        singleQuote: false,
        printWidth: 100,
        plugins: [],
        semi: true,
        tabWidth: 2,
        useTabs: false,
        jsxSingleQuote: false,
        quoteProps: "consistent",
        bracketSpacing: true,
        endOfLine: "lf",
        trailingComma: "all",
      },
    ],
    "no-console": "warn",
    "no-debugger": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "_.*",
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.test.{j,t}s?(x)"],
      env: { jest: true, node: true },
      rules: {
        "@typescript-eslint/ban-ts-comment": "off",
      },
    },
  ],
  ignorePatterns: ["node_modules", "**/node_modules/**/*", "**/dist/**", "dist"],
};

// eslint expects a `module.exports = config` style configuration assignment
// and does not accept a default export under any circumstances
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export = config;
