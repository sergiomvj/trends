import { GoogleTrendsProvider } from './services/scraper/providers/google-trends';
import { RSSProvider } from './services/scraper/providers/rss';
import { RedditProvider } from './services/scraper/providers/reddit';
import { YouTubeProvider } from './services/scraper/providers/youtube';

async function main() {
    console.log('🚀 Starting Scraper Test...');

    // 1. Test Google Trends
    try {
        console.log('\n📊 Testing Google Trends...');
        const google = new GoogleTrendsProvider();
        const trends = await google.getDailyTrends('BR');
        console.log(`✅ Fetched ${trends.length} daily trends from Google.`);
        if (trends.length > 0) {
            console.log('Sample:', trends[0].title);
        }
    } catch (e) {
        console.error('❌ Google Trends Failed:', e);
    }

    // 2. Test RSS
    try {
        console.log('\n📰 Testing RSS Feed...');
        const rss = new RSSProvider();
        const feed = await rss.getFeed('https://g1.globo.com/rss/g1/', 'G1');
        console.log(`✅ Fetched ${feed.length} items from RSS.`);
        if (feed.length > 0) {
            console.log('Sample:', feed[0].title);
        }
    } catch (e) {
        console.error('❌ RSS Failed:', e);
    }

    // 3. Test Reddit
    try {
        console.log('\n🤖 Testing Reddit...');
        const reddit = new RedditProvider();
        const posts = await reddit.getGeneralTrends();
        console.log(`✅ Fetched ${posts.length} posts from Reddit.`);
        if (posts.length > 0) {
            console.log('Sample:', posts[0].title, `(r/${posts[0].subreddit})`);
        }
    } catch (e) {
        console.error('❌ Reddit Failed:', e);
    }

    // 4. Test YouTube
    try {
        console.log('\n📺 Testing YouTube...');
        const youtube = new YouTubeProvider();
        const vids = await youtube.getTrendingVideos('BR');
        console.log(`✅ Fetched ${vids.length} videos from YouTube.`);
        if (vids.length > 0) {
            console.log('Sample:', vids[0].title, `(${vids[0].channelName})`);
        }
    } catch (e) {
        console.error('❌ YouTube Failed:', e);
    }
}

main();
