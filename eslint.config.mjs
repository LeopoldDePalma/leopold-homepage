import stylistic from '@stylistic/eslint-plugin';
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
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      // Always use braces for if/else/for/while, even around a single statement.
      curly: ['error', 'all'],
      // Blank lines around control blocks and before return, so each step of a function stands out.
      '@stylistic/padding-line-between-statements': [
        'error',
        {blankLine: 'always', prev: '*', next: ['block-like', 'return']},
        {blankLine: 'always', prev: 'block-like', next: '*'},
      ],
      // Prettier wraps code at 100 but can't split long strings; this catches those.
      'max-len': [
        'error',
        {code: 100, ignoreUrls: true, ignoreRegExpLiterals: true, ignoreComments: false},
      ],
    },
  },
  {
    // Command-line scripts talk to the terminal; printing is their interface, not a stray log.
    files: ['scripts/**'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx,mts}'],
    rules: {
      // Arrow functions only: components, handlers, helpers and callbacks.
      'func-style': ['error', 'expression'],
      'prefer-arrow-callback': 'error',
      'no-restricted-imports': [
        'error',
        {
          paths: [{name: 'lodash', message: 'Import from lodash-es (tree-shakeable ESM build).'}],
          patterns: [{group: ['lodash/*'], message: 'Import from lodash-es.'}],
        },
      ],
      'react/function-component-definition': [
        'error',
        {namedComponents: 'arrow-function', unnamedComponents: 'arrow-function'},
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: [
            'CallExpression > MemberExpression.callee > Identifier.property',
            '[name=/^(map|filter|reduce|find|findIndex|some|every|flatMap)$/]',
          ].join(''),
          message: 'Use the lodash-es function instead of the native array method.',
        },
        {
          selector: 'FunctionExpression:not(MethodDefinition > FunctionExpression)',
          message: 'Use an arrow function instead of a function expression.',
        },
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
  // Vendored three.js Basis transcoder (minified third-party code).
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'next-env.d.ts',
    'public/basis/**',
  ]),
]);
