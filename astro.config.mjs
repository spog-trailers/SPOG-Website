// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.spogtrailers.com',
  // The Workstation page started as a draft at /test-workstation (2026-11-17). Keep old links working.
  redirects: { '/test-workstation': '/workstation' },
  vite: {
    plugins: [tailwindcss()],
  },
});
