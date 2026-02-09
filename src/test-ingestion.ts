import 'dotenv/config';
import { GoogleTrendsProvider } from './services/scraper/providers/google-trends';
import { RSSProvider } from './services/scraper/providers/rss';
import { TrendsService } from './services/trends-service';
import { db } from './db';
import { trends } from './db/schema';
import { count } from 'drizzle-orm';

async function main() {
    console.log('🚀 Starting Data Ingestion Test...');
    const trendsService = new TrendsService();

    // 1. Ingest Google Trends (Mock)
    console.log('\n📊 Ingesting Google Trends...');
    const google = new GoogleTrendsProvider();
    const googleTrends = await google.getDailyTrends('BR');

    for (const trend of googleTrends) {
        const saved = await trendsService.upsertTrend({
            title: trend.title,
            url: trend.url,
            volume: trend.traffic,
            image: trend.image,
            category: 'Google Trends',
            metadata: { source: 'google_trends', original_data: trend }
        });
        if (saved) console.log(`   ✅ Saved: ${saved.title}`);
    }

    // 2. Ingest RSS
    console.log('\n📰 Ingesting RSS Feed...');
    const rss = new RSSProvider();
    const feed = await rss.getFeed('https://g1.globo.com/rss/g1/', 'G1');

    // Limit to 5 for testing
    for (const item of feed.slice(0, 5)) {
        const saved = await trendsService.upsertTrend({
            title: item.title,
            url: item.link,
            category: 'News',
            metadata: { source: 'rss_g1', pubDate: item.pubDate }
        });
        if (saved) console.log(`   ✅ Saved: ${saved.title}`);
    }

    // 3. Verify Database Count
    console.log('\n🔍 Verifying Database...');
    const result = await db.select({ count: count() }).from(trends);
    console.log(`Total trends in DB: ${result[0].count}`);

    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
