import {defineConfig, globalIgnores} from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'no-console': ['warn', {allow: ['warn', 'error']}],
      eqeqeq: ['error', 'always'],

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/no-duplicates': ['error', {'prefer-inline': true}],

      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {prefer: 'type-imports', fixStyle: 'inline-type-imports'},
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {argsIgnorePattern: '^_', varsIgnorePattern: '^_'},
      ],
      '@typescript-eslint/restrict-template-expressions': ['error', {allowNumber: true}],
      '@typescript-eslint/no-misused-promises': ['error', {checksVoidReturn: {attributes: false}}],

      'react/self-closing-comp': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-curly-brace-presence': ['error', {props: 'never', children: 'never'}],
    },
  },
  {
    // Config files are plain JS/ESM and not part of the TS project.
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  prettier,
  {
    // Declared after eslint-config-prettier, which switches these off.
    rules: {
      // Prettier wraps code at 100 but can't split long strings; this catches those.
      'max-len': [
        'error',
        {code: 100, ignoreUrls: true, ignoreRegExpLiterals: true, ignoreComments: false},
      ],
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: [
            'JSXAttribute > JSXExpressionContainer',
            '> :matches(ArrowFunctionExpression, FunctionExpression)',
          ].join(' '),
          message: 'Extract the inline function into a named handler (e.g. `handleClick`).',
        },
      ],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts']),
]);
