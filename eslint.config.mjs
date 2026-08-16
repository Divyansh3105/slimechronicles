import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules/", "dist/", "build/", "assets/"],
  },
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        window: "readonly",
        document: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        fetch: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "no-func-assign": "off",
      "no-useless-assignment": "off"
    }
  }
];
