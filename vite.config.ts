import { defineConfig } from 'vite';

import pkg from './package.json';
import rollupTextReplacePlugin from './rollup-plugin-text-replace';

const { version: pkgVersion } = pkg;

export default defineConfig({
  build: {
    lib: {
      entry: './src/main.ts',
      name: 'SVG3DTagCloud',
      fileName: 'SVG3DTagCloud',
    },
  },
  plugins: [
    rollupTextReplacePlugin([
      {
        placeholder: '__VERSION__',
        replacement: `v${pkgVersion}_Bt: ${new Date().toLocaleString()}`,
      },
    ]),
  ],
});
