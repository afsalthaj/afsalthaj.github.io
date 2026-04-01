// @ts-check

import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Default output is static; routes with `export const prerender = false` run on the Node server (subscribe API + admin).
// Pure static hosts (e.g. GitHub Pages) cannot run that server — use a Node-capable host for subscribe/admin.
export default defineConfig({
	site: 'https://afsalthaj.github.io',
	adapter: node({ mode: 'standalone' }),
	integrations: [mdx(), sitemap()],
});
