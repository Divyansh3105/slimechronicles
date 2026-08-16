import js from "@eslint/js";

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
      "no-undef": "warn"
    }
  }
];
