import { getCollection, type CollectionEntry } from 'astro:content';

export async function getAllBlogs() {
    return await getCollection('blog', ({ data }) => {
        if (import.meta.env.PROD) {
            // on production: exclude draft posts by default
            return !data.draft;
        }
        return true;
    });
}

// ascending = oldest to newest date
// descending = newest to oldest date
export function sortBlogsByDate(
    posts: Array<CollectionEntry<'blog'>>,
    order: 'ascending' | 'descending' = 'descending',
) {
    // -1 = ascending
    // 1 = descending
    const direction = order === 'descending' ? 1 : -1;

    return posts.sort((a, b) => {
        const aDate = new Date(
            a.data.date_updated ?? a.data.date_created,
        ).valueOf();
        const bDate = new Date(
            b.data.date_updated ?? b.data.date_created,
        ).valueOf();
        return (bDate - aDate) * direction;
    });
}

export function sortBlogsByPinned(posts: Array<CollectionEntry<'blog'>>) {
    return posts.sort((a, b) => {
        const aOrder = a.data.pin ? 1 : 100;
        const bOrder = b.data.pin ? 1 : 100;
        return aOrder - bOrder;
    });
}

export function getBlogsByTag(
    tag: string,
    posts: Array<CollectionEntry<'blog'>>,
) {
    return posts.filter((post) => {
        if (post.data.tags) {
            return post.data.tags.includes(tag);
        }
        return false;
    });
}
