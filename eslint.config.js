import js from "@eslint/js"
import prettierConfig from "eslint-config-prettier"
import html from "eslint-plugin-html"
import { defineConfig } from "eslint/config"
import globals from "globals"

const disabledRules = Object.fromEntries(
        [
            "capitalized-comments",
            "id-length",
            "init-declarations",
            "line-comment-position",
            "multiline-comment-style",
            "no-await-in-loop",
            "no-continue",
            "no-eq-null",
            "no-inline-comments",
            "no-magic-numbers",
            "no-param-reassign",
            "no-plusplus",
            "no-ternary",
            "no-undefined",
            "no-underscore-dangle",
            "no-warning-comments",
            "prefer-named-capture-group",
            "require-atomic-updates",
            "sort-keys",
            "sort-vars",
        ].map(ruleName => [ruleName, "off"]),
    ),
    commonRules = {
        complexity: ["warn", { max: 30 }],
        "dot-notation": ["warn", { allowKeywords: true }],
        eqeqeq: ["warn", "smart"],
        "func-style": ["warn", "declaration"],
        "max-depth": ["warn", { max: 5 }],
        "max-lines": ["warn", { max: 500 }],
        "max-lines-per-function": ["warn", { max: 300 }],
        "max-params": ["warn", { max: 5 }],
        "max-statements": ["warn", { max: 50 }],
        "no-console": ["warn", { allow: ["warn", "error", "info"] }],
        "no-unused-expressions": ["warn", { allowTernary: true }],
        "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
        "no-use-before-define": ["warn", { functions: false }],
        "one-var": ["warn", { const: "consecutive", let: "consecutive" }],
        "sort-imports": ["warn", { ignoreCase: true, ignoreDeclarationSort: true }],
    }

export default defineConfig([
    { ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/coverage/**"] },
    { linterOptions: { reportUnusedDisableDirectives: "warn" } },
    { files: ["**/*.{js,mjs,cjs,html}"], plugins: { html }, extends: [js.configs.all], languageOptions: { globals: { ...globals.node, ...globals.browser } }, rules: { ...disabledRules, ...commonRules } },
    { files: ["**/*.cjs"], languageOptions: { sourceType: "commonjs", globals: globals.commonjs } },
    { files: ["**/*.html"], rules: { "no-unused-vars": "off", "max-lines": "off", "max-lines-per-function": "off" } },
    { files: ["**/*.config.{js,mjs,cjs}"], rules: { "max-lines": "off", "max-lines-per-function": "off", "max-statements": "off" } },
    prettierConfig,
])
