import { pgTable, serial, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

export const sources = pgTable('sources', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type').notNull(), // 'google_trends', 'rss', 'reddit', 'youtube'
    url: text('url'),
    config: jsonb('config').default({}),
    isActive: boolean('is_active').default(true),
    orgId: text('org_id'), // Multi-tenancy support
    lastScrapedAt: timestamp('last_scraped_at'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const trends = pgTable('trends', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    score: integer('score').default(0),
    volume: integer('volume'),
    category: text('category'),
    sourceId: integer('source_id').references(() => sources.id),
    orgId: text('org_id'), // Multi-tenancy support
    metadata: jsonb('metadata').default({}), // Stores source-specific data (e.g. video views, upvotes)
    firstSeenAt: timestamp('first_seen_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const drafts = pgTable('drafts', {
    id: serial('id').primaryKey(),
    trendId: integer('trend_id').references(() => trends.id).notNull(),
    type: text('type').notNull(), // 'blog_post', 'twitter_thread', 'instagram'
    content: text('content').notNull(),
    status: text('status').default('draft'), // 'draft', 'published'
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
