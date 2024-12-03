/**
 * pocketbase loader
 * see https://github.com/pocketbase/pocketbase
 */

import type { Loader } from 'astro/loaders';
import { z } from 'astro:schema';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import PocketBase from 'pocketbase';
import { removeDupsAndLowercase } from './util';

export type BlogPost = {
    id: string;
    title: string;
    description?: string;
    date_created: string;
    date_updated: string;
    tags?: string;
    katex: boolean;
    pin: boolean;
    draft: boolean;
    content: string;
};

export const postSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().default(''),
    date_created: z.date().transform((v) => new Date(v)),
    date_updated: z
        .date()
        .default(new Date())
        .transform((v) => new Date(v)),
    tags: z.array(z.string()).default([]).transform(removeDupsAndLowercase),
    katex: z.boolean().default(false),
    pin: z.boolean().default(false),
    draft: z.boolean().default(true),
});

export const PocketBaseLoader = (conf: {
    url: string;
    user: string;
    pwd: string;
}): Loader => {
    const pb = new PocketBase(conf.url);

    return {
        name: 'astro_pocketbase_blog_loader',
        load: async (ctx) => {
            ctx.logger.info(`conf: ${JSON.stringify(conf)}`);
            const _authData = await pb
                .collection('_superusers')
                .authWithPassword(conf.user, conf.pwd);
            if (!pb.authStore.isValid) {
                ctx.logger.warn(
                    `collection BlogPost auth with password error!`,
                );
                return;
            }

            const last_modified =
                ctx.meta.get('last-modified') ??
                new Date(1900, 0, 0).toISOString();
            ctx.logger.info(`>>> last-modified: ${last_modified}`);

            const posts = (
                await pb.collection('BlogPosts').getFullList<BlogPost>({
                    filter: `date_updated >= "${last_modified}"`,
                })
            ).map((it) => {
                return {
                    ...it,
                    date_created: new Date(it.date_created),
                    date_updated: new Date(it.date_updated),
                    tags: it.tags ? it.tags.split(',') : [],
                };
            });
            pb.authStore.clear();

            const markdownProcessor = await createMarkdownProcessor(
                ctx.config.markdown,
            );
            for (const post of posts) {
                const data = await ctx.parseData({
                    id: post.id,
                    data: post,
                });
                const digest = await ctx.generateDigest(data);
                const { code: html, metadata } = await markdownProcessor.render(
                    post.content,
                );
                ctx.store.set({
                    id: post.id,
                    data: data,
                    body: post.content,
                    rendered: {
                        html: html,
                        metadata: {
                            ...metadata,
                            imagePaths: [...metadata.imagePaths],
                        },
                    },
                    digest: digest,
                });
                ctx.logger.info(`>>> store post: ${post.title}`);
            }
            ctx.meta.set('last-modified', new Date().toISOString());
        },
        schema: postSchema,
    };
};
