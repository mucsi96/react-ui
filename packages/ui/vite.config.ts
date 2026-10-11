import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('src/entry.ts', import.meta.url)),
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'styles',
    },
    rolldownOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-aria-components'],
      output: { banner: "'use client';" },
    },
  },
});
