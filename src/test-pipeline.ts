import 'dotenv/config';
import { GoogleTrendsProvider } from './services/scraper/providers/google-trends';
import { TrendsService } from './services/trends-service';
import { db } from './db';
import { trends } from './db/schema';
import { count } from 'drizzle-orm';

async function main() {
    console.log('🚀 Starting Pipeline Test...');

    const trendsService = new TrendsService();

    // 1. Google Trends
    try {
        console.log('\n📊 Fetching from Google Trends...');
        const googleProvider = new GoogleTrendsProvider();
        const googleTrends = await googleProvider.getDailyTrends('BR');
        console.log(`Found ${googleTrends.length} trends.`);

        if (googleTrends.length > 0) {
            console.log('Saving first trend to DB:', googleTrends[0].title);
            const trend = googleTrends[0];
            const saved = await trendsService.upsertTrend({
                title: trend.title,
                url: trend.url,
                volume: trend.traffic,
                image: trend.image,
                category: 'Google Trends',
                metadata: { source: 'google_trends', original_data: trend }
            });
            console.log('✅ Saved/Updated Trend ID:', saved?.id);
        }
    } catch (e: any) {
        console.error('❌ Google Pipeline Failed:', e);
    }

    // 2. Count DB records
    try {
        const result = await db.select({ count: count() }).from(trends);
        console.log('\n📈 Total Trends in DB:', result[0].count);
    } catch (e: any) {
        console.error('❌ DB Verification Failed:', e);
    }

    console.log('\n🏁 Pipeline Test Complete.');
    process.exit(0);
}

main();
