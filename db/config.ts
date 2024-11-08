import { defineDb, defineTable, column } from 'astro:db';

const Blog = defineTable({
    columns: {
        id: column.text({ unique: true }),
        title: column.text(),
        description: column.text(),
        date_created: column.text(),
        date_updated: column.text(),
        tags: column.text(),
        katex: column.boolean(),
        pin: column.text(),
        draft: column.text(),
        content: column.text(),
    },
    indexes: [{ on: ['id', 'title'] }],
});

const Trash = defineTable({
    columns: {
        id: column.text({ unique: true }),
        title: column.text(),
        description: column.text(),
        date_created: column.text(),
        date_updated: column.text(),
        tags: column.text(),
        katex: column.boolean(),
        pin: column.text(),
        draft: column.text(),
        content: column.text(),
    },
    indexes: [{ on: ['id', 'title'] }],
});

export default defineDb({
    tables: { Blog, Trash },
});
