// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.spogtrailers.com',
  // Keep old draft links working. The Workstation page started at /test-workstation (2026-11-17).
  // Test homepage 2 became the homepage and the first test homepage was removed (2026-11-18).
  // The old /cargo page was retired on 2026-11-20 (Nate): /cargo-2 is the Cargo page now.
  redirects: { '/test-workstation': '/workstation', '/test-home': '/', '/test-home-2': '/', '/cargo': '/cargo-2' },
  vite: {
    plugins: [tailwindcss()],
  },
});
