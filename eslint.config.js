import js from '@eslint/js';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';

export default [
  js.configs.recommended, // 'eslint:recommended'
  typescriptPlugin.configs.recommended, // 'plugin:@typescript-eslint/recommended'
  react.configs.recommended, // 'plugin:react/recommended'
  prettier.configs.recommended, // 'plugin:prettier/recommended'
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        document: 'readonly',
        window: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      react,
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' }, // '_'로 시작하는 매개변수를 무시
      ],
    },
  },
];
