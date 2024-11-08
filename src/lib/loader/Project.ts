/**
 * 项目加载
 */

import { z } from 'astro:schema';
import { removeDupsAndLowercase } from './util';

export const projectSchema = z.object({
    title: z.string(),
    description: z.string(),
    date_created: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
    date_updated: z
        .string()
        .or(z.date())
        .transform((val) => (val ? new Date(val) : undefined))
        .optional(),
    stack: z.array(z.string()).default([]).transform(removeDupsAndLowercase),
    platform: z.string().optional(),
    website: z.string().optional(),
    github: z.string().optional(),
    draft: z.boolean().default(false),
    // for pinning projects
    pin: z.boolean().default(false),
});
