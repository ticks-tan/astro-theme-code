/**
 * 博客本地加载
 */

import { z } from 'astro:schema';
import { removeDupsAndLowercase } from './util';

export const localBlogSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().default('').optional(),
    date_created: z.date().transform((v) => new Date(v)),
    date_updated: z
        .date()
        .default(new Date())
        .transform((v) => new Date(v))
        .optional(),
    tags: z
        .array(z.string())
        .default([])
        .transform(removeDupsAndLowercase)
        .optional(),
    katex: z.boolean().default(false),
    pin: z.boolean().default(false),
    draft: z.boolean().default(true),
});
