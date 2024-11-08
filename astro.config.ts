import { defineConfig, passthroughImageService } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import astroExpressiveCode from 'astro-expressive-code';
import tailwind from '@astrojs/tailwind';
import robotsTxt from 'astro-robots-txt';

import { expressiveCodeOptions } from './src/consts';
import { remarkReadingTime } from './src/lib/plugin/remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
    site: 'https://blog.ppixiu.com',
    integrations: [
        astroExpressiveCode(expressiveCodeOptions),
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
    image: {
        service: passthroughImageService(),
    },
    markdown: {
        remarkPlugins: [remarkReadingTime],
        syntaxHighlight: 'shiki',
    },
    output: 'static',
    vite: {
        build: {
            minify: false,
        },
    },
});
