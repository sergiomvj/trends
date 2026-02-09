import 'dotenv/config';
import { FirecrawlProvider } from './services/scraper/providers/firecrawl';

async function testFirecrawl() {
    console.log('🔥 Testing Firecrawl Provider...');

    // Check Env
    if (!process.env.FIRECRAWL_API_URL || !process.env.FIRECRAWL_API_KEY) {
        console.error('❌ FIRECRAWL_API_URL or FIRECRAWL_API_KEY not set in .env');
        process.exit(1);
    }
    console.log(`URL: ${process.env.FIRECRAWL_API_URL}`);
    console.log(`API Key: ${process.env.FIRECRAWL_API_KEY.substring(0, 5)}...`);

    const provider = new FirecrawlProvider();
    const testUrl = 'https://example.com';

    console.log(`\n1. Scraping ${testUrl}...`);
    const result = await provider.scrape(testUrl);

    if (result && result.success) {
        console.log('✅ Scrape Success!');
        console.log('Title:', result.data.metadata?.title || 'No Title');
        console.log('Content Preview:', result.data.markdown.substring(0, 100) + '...');
    } else {
        console.error('❌ Scrape Failed.');
    }
}

testFirecrawl().catch(console.error);
