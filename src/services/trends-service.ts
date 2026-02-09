import { db } from '@/db';
import { trends } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { calculateViralScore } from '@/lib/utils/scoring';

export interface CreateTrendDTO {
    title: string;
    url?: string;
    description?: string;
    volume?: string;
    sourceId?: number;
    category?: string;
    image?: string;
    orgId?: string; // Added for multi-tenancy
    metadata?: any;
}

export class TrendsService {

    async upsertTrend(data: CreateTrendDTO) {
        try {
            // Simple slug generation for now
            const slug = this.generateSlug(data.title);
            const volumeNum = data.volume ? parseInt(data.volume.replace(/\D/g, '')) || 0 : 0;

            // Initial score calculation
            const initialScore = calculateViralScore({
                volume: volumeNum,
                socialScore: data.metadata?.score || 0
            });

            // Check if exists within the same organization
            const existing = await db.select().from(trends).where(
                and(
                    eq(trends.slug, slug),
                    data.orgId ? eq(trends.orgId, data.orgId) : undefined
                )
            ).limit(1);

            if (existing.length > 0) {
                // Update
                await db.update(trends).set({
                    volume: volumeNum,
                    score: Math.max(existing[0].score || 0, initialScore),
                    updatedAt: new Date(),
                }).where(eq(trends.id, existing[0].id));
                return existing[0];
            } else {
                // Insert
                const newTrend = await db.insert(trends).values({
                    title: data.title,
                    slug: slug,
                    volume: volumeNum,
                    score: initialScore,
                    sourceId: data.sourceId,
                    orgId: data.orgId || 'default',
                    category: data.category || 'General',
                    metadata: {
                        url: data.url,
                        image: data.image,
                        ...data.metadata
                    }
                }).returning();
                return newTrend[0];
            }
        } catch (error) {
            console.error(`Error upserting trend ${data.title}:`, error);
            return null; // Fail safe
        }
    }

    private generateSlug(title: string): string {
        return title.toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // remove accents
            .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with hyphens
            .replace(/^-+|-+$/g, ''); // remove leading/trailing hyphens
    }

    /**
     * Enriches a trend with full content using Firecrawl
     */
    async enrichTrendWithContent(trendId: number, url: string) {
        if (!url) return null;

        try {
            const { FirecrawlProvider } = await import('./scraper/providers/firecrawl');
            const firecrawl = new FirecrawlProvider();

            const result = await firecrawl.scrape(url);

            if (result && result.success) {
                // Fetch current metadata to merge
                const current = await db
                    .select({ metadata: trends.metadata })
                    .from(trends)
                    .where(eq(trends.id, trendId))
                    .limit(1);

                const currentMetadata = current[0]?.metadata || {};

                // Update trend with content in metadata
                await db.update(trends).set({
                    metadata: {
                        ...(currentMetadata as object),
                        content: result.data.markdown,
                        firecrawl_success: true,
                        scraped_at: new Date().toISOString(),
                        ...result.data.metadata
                    },
                    updatedAt: new Date()
                }).where(eq(trends.id, trendId));

                return result.data;
            }
        } catch (error) {
            console.error(`Error enriching trend ${trendId}:`, error);
        }
        return null;
    }
}
