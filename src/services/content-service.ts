import { db } from '@/db';
import { drafts, trends } from '@/db/schema';
import { eq } from 'drizzle-orm';
import axios from 'axios';

export type DraftType = 'blog_post' | 'twitter_thread' | 'instagram';

export class ContentService {
    /**
     * Generates a content draft using AI (via n8n or direct LLM)
     */
    async generateDraft(trendId: number, type: DraftType) {
        try {
            const [trend] = await db.select().from(trends).where(eq(trends.id, trendId)).limit(1);
            if (!trend) throw new Error('Trend not found');

            console.log(`✍️ Generating ${type} for: ${trend.title}`);

            let content = "";

            // 1. Call n8n Content Generator Webhook
            if (process.env.N8N_CONTENT_WEBHOOK_URL) {
                const response = await axios.post(process.env.N8N_CONTENT_WEBHOOK_URL, {
                    trendId: trend.id,
                    title: trend.title,
                    description: trend.description,
                    type: type
                });
                content = response.data.content;
            } else {
                // Fallback Mock Content
                content = this.generateMockContent(trend.title, type);
            }

            // 2. Save Draft to DB
            const newDraft = await db.insert(drafts).values({
                trendId: trend.id,
                type: type,
                content: content,
                status: 'draft'
            }).returning();

            return newDraft[0];

        } catch (error) {
            console.error(`Error generating draft:`, error);
            throw error;
        }
    }

    private generateMockContent(title: string, type: DraftType): string {
        if (type === 'twitter_thread') {
            return `🧵 Por que "${title}" está bombando hoje:\n\n1/7 Recentemente vimos um aumento massivo de interesse em ${title}...\n\n2/7 Os dados mostram que a comunidade no Reddit está liderando a conversa...\n\n#Trends #Viral #${title.replace(/\s+/g, '')}`;
        }
        if (type === 'blog_post') {
            return `<h1>Tudo o que você precisa saber sobre ${title}</h1><p>A tendência ${title} surgiu repentinamente...</p><p>Neste artigo, exploramos os sinais de viralidade e por que você deve prestar atenção.</p>`;
        }
        return `Confira a nova tendência: ${title}! 🚀 #Viral #FBRTrends`;
    }

    /**
     * Fetch existing drafts for a trend
     */
    async getDraftsByTrend(trendId: number) {
        return await db.select().from(drafts).where(eq(drafts.trendId, trendId));
    }
}
