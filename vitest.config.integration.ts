import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: false,
  test: {
    include: ['module/core/src/infrastructure/**/*.int.test.ts'],
    threads: false,
  },
  plugins: [typescript()],
});
