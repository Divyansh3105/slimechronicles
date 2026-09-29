import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules/", "dist/", "build/", "assets/"],
  },
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      // Plain <script> tags, not ES modules
      sourceType: "script",
      globals: {
        ...globals.browser,
        // `module` is only touched behind a typeof guard so vitest can require() these files
        module: "writable",
        // CDN scripts
        particlesJS: "readonly",
        gsap: "readonly",
        ScrollTrigger: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["error", { caughtErrors: "none" }],
      "no-undef": "error",
      // character.js wraps its own functions by reassignment; clean up separately
      "no-func-assign": "off",
      "no-useless-assignment": "off",
    },
  },
];
