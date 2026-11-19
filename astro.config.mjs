// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.spogtrailers.com',
  // Keep old draft links working. The Workstation page started at /test-workstation (2026-11-17).
  // Test homepage 2 became the homepage and the first test homepage was removed (2026-11-18).
  redirects: { '/test-workstation': '/workstation', '/test-home': '/', '/test-home-2': '/' },
  vite: {
    plugins: [tailwindcss()],
  },
});
