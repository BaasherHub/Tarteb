import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@/core/lib/supabase',
        replacement: path.resolve(__dirname, 'src/testing/mocks/supabase.ts'),
      },
      {
        find: 'react-native-url-polyfill/auto',
        replacement: path.resolve(__dirname, 'src/testing/mocks/empty.ts'),
      },
      {
        find: '@react-native-async-storage/async-storage',
        replacement: path.resolve(__dirname, 'src/testing/mocks/asyncStorage.ts'),
      },
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
  },
});
