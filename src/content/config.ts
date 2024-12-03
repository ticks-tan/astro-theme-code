import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { PocketBaseLoader, postSchema } from '~/lib/loader/PocketBaseLoader';
import { projectSchema } from '~/lib/loader/Project';

// 博客集合
const blog = defineCollection({
    type: 'content_layer',
    loader: PocketBaseLoader({
        url: import.meta.env.POCKETBASE_URL,
        user: import.meta.env.POCKETBASE_USER,
        pwd: import.meta.env.POCKETBASE_PWD,
    }),
    schema: postSchema,
});

// 项目集合
const project = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: './content/project' }),
    schema: projectSchema,
});

export const collections = { blog, project };
