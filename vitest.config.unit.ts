import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: false,
  plugins: [typescript()],
  test: {
    include: ['module/core/src/**/*.test.ts'],
    exclude: ['module/core/src/infrastructure/**/*.int.test.ts'],
  },
});
