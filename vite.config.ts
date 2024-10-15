import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/main.ts',
      name: 'SVG3DTagCloud',
      fileName: 'SVG3DTagCloud',
    },
  },
});
