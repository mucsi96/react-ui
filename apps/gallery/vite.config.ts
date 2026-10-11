import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/react-ui/' : '/',
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-aria',
              test: /node_modules\/(?:react-aria|react-stately|react-aria-components|@internationalized|@react-types)\//,
            },
          ],
        },
      },
    },
  },
});
