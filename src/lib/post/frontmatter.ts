import type { CollectionEntry } from 'astro:content';

// should only be used with frontmatter arrays
export function getAllBlogsByProperty(
    prop: 'tags',
    posts: Array<CollectionEntry<'blog'>>,
) {
    return posts.flatMap(({ data }) => {
        return data[prop] ?? [];
    });
}

export function getUniqueBlogsByProperty(
    prop: 'tags',
    posts: Array<CollectionEntry<'blog'>>,
) {
    return [...new Set(getAllBlogsByProperty(prop, posts))];
}

export function getUniqueBlogsWithCountByProperty(
    prop: 'tags',
    posts: Array<CollectionEntry<'blog'>>,
): Array<[string, number]> {
    return [
        ...getAllBlogsByProperty(prop, posts).reduce(
            (acc, t) => acc.set(t, (acc.get(t) || 0) + 1),
            new Map<string, number>(),
        ),
    ].sort((a, b) => b[1] - a[1]);
}
