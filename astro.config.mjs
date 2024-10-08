import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import astroExpressiveCode from 'astro-expressive-code';
import { expressiveCodeOptions } from './src/consts';
import { remarkReadingTime } from './src/utils/remark-reading-time.mjs';
import tailwind from '@astrojs/tailwind';

import robotsTxt from 'astro-robots-txt';

// https://astro.build/config
export default defineConfig({
    site: 'https://astro-theme-code.vercel.app',
    integrations: [
        astroExpressiveCode(expressiveCodeOptions),
        mdx(),
        sitemap(),
        tailwind(),
        robotsTxt({
            sitemap: true,
            sitemapBaseFileName: 'sitemap-0',
            policy: [
                {
                    userAgent: '*',
                    disallow: '/',
                },
                {
                    userAgent: 'Googlebot',
                    allow: '/',
                },
                {
                    userAgent: 'Bingbot',
                    allow: '/',
                },
            ],
        }),
    ],
    prefetch: true,
    markdown: {
        remarkPlugins: [remarkReadingTime],
        syntaxHighlight: 'shiki',
        // shikiConfig: {
        // 	// https://docs.astro.build/en/guides/markdown-content/#syntax-highlighting
        // 	themes: {
        // 		light: "material-theme-lighter",
        // 		dark: "material-theme-darker",
        // 	},
        // },
    },
});
