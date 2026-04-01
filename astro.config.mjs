// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Pure static deployment for GitHub Pages.
export default defineConfig({
	site: 'https://afsalthaj.github.io',
	integrations: [mdx(), sitemap()],
});
