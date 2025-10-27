import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

const SourceFiles = ["src/**/*.ts", "src/**/*.test.ts", "test/**/*.ts", "examples/**/*.ts"];

export default tseslint.config(
    {
        extends: [js.configs.recommended],
        files: SourceFiles,
        ignores: ["src/**/*.ohm-bundle.d.ts"],
    },
    {
        extends: [tseslint.configs.recommendedTypeChecked],
        files: SourceFiles,
        ignores: ["src/**/*.ohm-bundle.d.ts"],
    },
    {
        files: SourceFiles,
        ignores: ["src/**/*.ohm-bundle.d.ts"],
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            "@stylistic": stylistic
        },
        rules: {
            "@typescript-eslint/no-non-null-assertion": 0,
            "@typescript-eslint/restrict-template-expressions": 0,
            "@typescript-eslint/prefer-literal-enum-member": 0,
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/no-import-type-side-effects": "error",

            "@typescript-eslint/no-unused-expressions": 0,   // it keeps flagging logtape log calls

            "no-unused-private-class-members": "warn",

            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],

            camelcase: [
                "error",
                {
                    allow: ["content_type"],
                },
            ],

            "@stylistic/indent": [
                "warn",
                4,
                {
                    ArrayExpression: "first",

                    CallExpression: {
                        arguments: "first",
                    },

                    FunctionDeclaration: {
                        parameters: "first",
                    },

                    FunctionExpression: {
                        parameters: "first",
                    },
                    SwitchCase: 1
                },
            ],
          //  "@stylistic/quotes": ["warn", "double"],

            "no-eval": "error",
            "no-implied-eval": "error",
            "no-invalid-this": "error",
            "@typescript-eslint/no-shadow": "error",
            "no-shadow": 0,
            "@typescript-eslint/promise-function-async": "error",
            "prefer-promise-reject-errors": "error",
            "require-atomic-updates": 0,    // wayyy too many false positives
            "@/semi": ["error"],
            "@/space-infix-ops": ["error"],
            "@/space-before-blocks": "error",
            "no-template-curly-in-string": "error",
            "no-unmodified-loop-condition": "error",
            "no-useless-assignment": "warn",
            eqeqeq: "warn",
            "prefer-const": 0,

            "@typescript-eslint/no-unsafe-enum-comparison": "warn", // TODO
            "@typescript-eslint/no-explicit-any": "warn", // TODO
        },
    },
);
