import globals from "globals";
import pluginJs from "@eslint/js";
import { warn } from "console";


/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.js"] },
    { ignores: ["dist/**", "assets/**"] },
    { languageOptions: { sourceType: "module", globals: globals.browser } },
    pluginJs.configs.recommended,
    {
        rules: {
            "no-unused-vars": "warn"
        }
    }
];