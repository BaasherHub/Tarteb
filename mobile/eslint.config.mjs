import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['node_modules/**', 'dist/**', '.expo/**'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      // Warn on cross-feature imports — existing shared UI/constants may still cross boundaries.
      'import/no-restricted-paths': [
        'warn',
        {
          zones: [
            {
              target: './src/features/auth',
              from: './src/features',
              except: ['./auth'],
            },
            {
              target: './src/features/candidate',
              from: './src/features',
              except: ['./candidate'],
            },
            {
              target: './src/features/employer',
              from: './src/features',
              except: ['./employer'],
            },
            {
              target: './src/features/settings',
              from: './src/features',
              except: ['./settings'],
            },
            {
              target: './src/features/app',
              from: './src/features',
              except: ['./app'],
            },
            // Shared/core must not depend on feature modules.
            {
              target: [
                './src/shared',
                './src/core/config',
                './src/core/hooks',
                './src/core/i18n',
                './src/core/lib',
                './src/core/theme',
              ],
              from: ['./src/features'],
            },
          ],
        },
      ],
    },
  },
);
