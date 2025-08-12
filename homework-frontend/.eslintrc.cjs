/** @type {import('@types/eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  globals: {},
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended', // Должно быть последним!
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'prettier',
  ],
  rules: {
    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // TypeScript
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { fixStyle: 'separate-type-imports' },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // Redux Toolkit specific rules
    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react-redux',
            importNames: ['useSelector', 'useStore', 'useDispatch'],
            message:
              'Please use pre-typed versions from `src/app/hooks.ts` instead.',
          },
        ],
      },
    ],

    // General rules
    curly: ['error', 'all'],
    'prefer-const': 'error',
    'no-var': 'error',
    'no-shadow-restricted-names': 'error',
    'no-console': 'warn',
    eqeqeq: ['error', 'always'],

    // React specific
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',

    // Accessibility
    'jsx-a11y/no-autofocus': 'off',

    // Prettier
    'prettier/prettier': [
      'error',
      {
        semi: true,
        endOfLine: 'auto',
        singleQuote: true,
        trailingComma: 'es5',
        printWidth: 80,
        tabWidth: 2,
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off',
      },
    },
  ],
  ignorePatterns: [
    'dist',
    'node_modules',
    '*.config.js',
    '*.config.ts',
    'vite.config.ts',
    'coverage',
  ],
};
