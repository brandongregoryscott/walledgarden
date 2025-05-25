import { defineConfig } from "eslint/config";
import stylisticPlugin from "@stylistic/eslint-plugin";
import collationPlugin from "eslint-plugin-collation";
import importPlugin from "eslint-plugin-import";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import typescriptSortKeys from "eslint-plugin-typescript-sort-keys";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptEslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";

const eslintConfig = defineConfig([
    {
        languageOptions: { parser: typescriptEslint.parser },
        plugins: {
            "@next/next": nextPlugin,
            "@stylistic": stylisticPlugin,
            "@typescript-eslint": typescriptEslintPlugin,
            collation: collationPlugin,
            import: importPlugin,
            perfectionist: perfectionistPlugin,
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            "typescript-sort-keys": typescriptSortKeys,
        },
        rules: {
            "@stylistic/padding-line-between-statements": [
                "error",
                {
                    blankLine: "always",
                    next: "export",
                    prev: "*",
                },
                {
                    blankLine: "never",
                    next: "export",
                    prev: "export",
                },
                {
                    blankLine: "always",
                    next: "*",
                    prev: "import",
                },
                {
                    blankLine: "never",
                    next: "import",
                    prev: "import",
                },
            ],
            "@typescript-eslint/consistent-type-definitions": "error",
            "@typescript-eslint/consistent-type-exports": "error",
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/strict-boolean-expressions": "error",
            "collation/group-exports": "error",
            "collation/no-default-export": "error",
            "collation/no-inline-export": "error",
            "collation/sort-dependency-list": "error",
            "collation/sort-exports": "error",
            curly: "error",
            eqeqeq: [
                "error",
                "always",
                {
                    null: "ignore",
                },
            ],
            "import/no-duplicates": "error",
            "no-console": "error",
            "perfectionist/sort-intersection-types": "error",
            "perfectionist/sort-union-types": "error",
            "react-hooks/exhaustive-deps": "error",
            "react-hooks/rules-of-hooks": "error",
            "react/display-name": "error",
            "react/hook-use-state": "error",
            "react/jsx-boolean-value": ["error", "always"],
            "react/jsx-handler-names": "error",
            "react/jsx-no-constructed-context-values": "error",
            "react/jsx-sort-props": "error",
            "react/self-closing-comp": "error",
            "typescript-sort-keys/interface": [
                "error",
                "asc",
                {
                    caseSensitive: false,
                },
            ],
            "typescript-sort-keys/string-enum": "error",
        },
    },
]);

// eslint-disable-next-line collation/no-default-export -- This needs to be a default export
export default eslintConfig;
