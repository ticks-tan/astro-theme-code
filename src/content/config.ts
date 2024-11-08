import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { DirectusLoader, directSchema } from '~/lib/loader/DirectusLoader';
import { projectSchema } from '~/lib/loader/Project';

// 博客集合
const blog = defineCollection({
    type: 'content_layer',
    loader: DirectusLoader({
        url: import.meta.env.DIRECTUS_URL,
        token: import.meta.env.DIRECTUS_TOKEN,
    }),
    schema: directSchema,
});

// 项目集合
const project = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: './content/project' }),
    schema: projectSchema,
});

export const collections = { blog, project };
