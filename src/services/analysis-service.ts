import { db } from '@/db';
import { trends } from '@/db/schema';
import { eq } from 'drizzle-orm';
import axios from 'axios';
import { calculateViralScore } from '@/lib/utils/scoring';

export class AnalysisService {
    /**
     * Enriches a trend with AI analysis and updated viral score
     * Can be called manually or triggered by a webhook
     */
    async analyzeTrend(trendId: number) {
        try {
            const [trend] = await db.select().from(trends).where(eq(trends.id, trendId)).limit(1);

            if (!trend) return null;

            console.log(`🧠 Analyzing trend: ${trend.title}`);

            // 1. Calculate Initial Score based on scraped data
            const socialScore = (trend.metadata as any)?.score || 0;
            const viralScore = calculateViralScore({
                volume: trend.volume || 0,
                socialScore: socialScore,
                velocity: 10, // Simulated growth for now
            });

            // 2. Call n8n AI Workflow (Optional - fallback if env not set)
            let aiSummary = trend.description || "";
            let sentiment = 0.5;

            if (process.env.N8N_ANALYSIS_WEBHOOK_URL) {
                try {
                    const response = await axios.post(process.env.N8N_ANALYSIS_WEBHOOK_URL, {
                        id: trend.id,
                        title: trend.title,
                        description: trend.description,
                        metadata: trend.metadata
                    });

                    if (response.data) {
                        aiSummary = response.data.summary || aiSummary;
                        sentiment = response.data.sentiment || sentiment;
                    }
                } catch (e) {
                    console.warn('n8n Analysis Webhook failed, using fallback logic');
                }
            }

            // 3. Update Trend in DB
            const updatedTrend = await db.update(trends).set({
                score: viralScore,
                description: aiSummary,
                metadata: {
                    ...(trend.metadata as object),
                    sentiment: sentiment,
                    analyzedAt: new Date().toISOString()
                },
                updatedAt: new Date()
            }).where(eq(trends.id, trendId)).returning();

            return updatedTrend[0];

        } catch (error) {
            console.error(`Error analyzing trend ${trendId}:`, error);
            return null;
        }
    }

    /**
     * Batched analysis for newly ingested trends
     */
    async analyzeNewTrends(limit = 10) {
        // Logic to find trends without analysis and process them
        const pending = await db.select().from(trends)
            .where(eq(trends.score, 0)) // Assuming 0 means not yet analyzed or just initialized
            .limit(limit);

        for (const trend of pending) {
            await this.analyzeTrend(trend.id);
        }
    }
}
