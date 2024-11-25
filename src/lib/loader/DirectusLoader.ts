/**
 * directus loader
 */
import type { Loader } from 'astro/loaders';
import { z } from 'astro:schema';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { createDirectus, rest, authentication, readItems } from '@directus/sdk';
import { removeDupsAndLowercase } from './util';

export type DirectusBlogPost = {
    id: string;
    title: string;
    description?: string;
    date_created: string;
    date_updated?: string;
    tags?: string;
    katex: boolean;
    pin: boolean;
    draft: boolean;
    content: string;
};

type DirectusSchema = {
    BlogPosts: DirectusBlogPost[];
};

export const directSchema = z.object({
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

export const DirectusLoader = (conf: {
    url: string;
    token: string;
}): Loader => {
    const client = createDirectus<DirectusSchema>(conf.url)
        .with(rest())
        .with(authentication());
    return {
        name: 'astro_directus_blog_loader',
        load: async (ctx) => {
            // 登录
            await client.setToken(conf.token);
            // 最后修改时间
            const last_modified =
                ctx.meta.get('last-modified') ??
                new Date(1900, 0, 0).toISOString();
            ctx.logger.info(`>>> last-modified: ${last_modified}`);
            // 获取文章
            const posts = (
                await client.request(
                    readItems('BlogPosts', {
                        filter: {
                            _or: [
                                {
                                    date_created: {
                                        _gt: last_modified,
                                    } as any,
                                },
                                {
                                    date_updated: {
                                        _gt: last_modified,
                                    } as any,
                                },
                            ],
                        },
                    }),
                )
            ).map((it) => ({
                ...it,
                date_created: new Date(it.date_created),
                date_updated: it.date_updated
                    ? new Date(it.date_updated)
                    : new Date(it.date_created),
                tags: it.tags ? it.tags.split(',') : [],
            }));
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
        schema: directSchema,
    };
};
