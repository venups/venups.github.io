import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import markdown from './plugins/markdown.js';

// BASE PATH
// "/" is right for https://venups.github.io and for a custom domain or an
// Azure Static Web App. Only if you ever host the site in a sub-folder
// (e.g. https://example.com/portfolio/) build with:
//   VITE_BASE=/portfolio/ npm run build
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), markdown()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 700,
  },
});
