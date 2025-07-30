import { defineConfig, globalIgnores } from "eslint/config";
import myPlugin from "@ota-meshi/eslint-plugin";

export default defineConfig([
  {
    extends: [
      ...myPlugin.config({
        node: true,
        ts: true,
        prettier: true,
        packageJson: true,
        json: true,
      }),
    ],

    rules: {
      "jsdoc/require-jsdoc": "error",
      "no-warning-comments": "warn",
      "no-lonely-if": "off",
      "no-shadow": "off",
    },
  },
  {
    files: ["**/*.ts"],

    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },

    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "property",
          format: null,
        },
        {
          selector: "method",
          format: null,
        },
        {
          selector: "import",
          format: null,
        },
      ],

      "no-implicit-globals": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["scripts/**/*.ts", "tests/**/*.ts"],

    rules: {
      "jsdoc/require-jsdoc": "off",
      "no-console": "off",
      "@typescript-eslint/no-shadow": "off",
    },
  },
  globalIgnores([
    ".nyc_output",
    "coverage",
    "lib",
    "node_modules",
    "tests/fixtures/**/*.json",
  ]),
]);
