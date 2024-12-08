import globals from 'globals';
import pluginJs from '@eslint/js';
import babelParser from '@babel/eslint-parser';

const ignores = ['**/node_modules/', '**/lib/', '**/dist/'];
/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ignores,
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      parser: babelParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        requireConfigFile: false,
        allowImportExportEverywhere: false,
      },
    },
    rules: {},
  },
  pluginJs.configs.recommended,
  // pluginJs.configs.all
];
