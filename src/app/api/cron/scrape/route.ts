import { NextResponse } from 'next/server';
import { GoogleTrendsProvider } from '@/services/scraper/providers/google-trends';
import { RSSProvider } from '@/services/scraper/providers/rss';
import { RedditProvider } from '@/services/scraper/providers/reddit';
import { TrendsService } from '@/services/trends-service';

// This route should be protected by a secret key in production
export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // return new NextResponse('Unauthorized', { status: 401 });
        // Allowing open access for dev/testing for now
    }

    const trendsService = new TrendsService();
    const results = {
        google: 0,
        rss: 0,
        reddit: 0,
        errors: [] as string[]
    };

    // 1. Run Google Trends
    try {
        const googleProvider = new GoogleTrendsProvider();
        const googleTrends = await googleProvider.getDailyTrends('BR');

        for (const trend of googleTrends) {
            await trendsService.upsertTrend({
                title: trend.title,
                url: trend.url,
                volume: trend.traffic,
                image: trend.image,
                category: 'Google Trends',
                metadata: { source: 'google_trends', original_data: trend }
            });
        }
        results.google = googleTrends.length;
    } catch (e: any) {
        console.error("Google Scraper Error", e);
        results.errors.push(`Google: ${e.message}`);
    }

    // 2. Run RSS Feeds (Example: G1)
    try {
        const rssProvider = new RSSProvider();
        const feed = await rssProvider.getFeed('https://g1.globo.com/rss/g1/', 'G1');

        for (const item of feed) {
            await trendsService.upsertTrend({
                title: item.title,
                url: item.link,
                category: 'News',
                metadata: { source: 'rss_g1', pubDate: item.pubDate, raw_item: item }
            });
        }
        results.rss = feed.length;
    } catch (e: any) {
        console.error("RSS Scraper Error", e);
        results.errors.push(`RSS: ${e.message}`);
    }

    // 3. Run Reddit Trends
    try {
        const redditProvider = new RedditProvider();
        const redditTrends = await redditProvider.getGeneralTrends();

        for (const post of redditTrends) {
            await trendsService.upsertTrend({
                title: post.title,
                url: post.url,
                category: post.subreddit,
                metadata: {
                    source: 'reddit',
                    score: post.score,
                    comments: post.numComments,
                    author: post.author,
                    thumbnail: post.thumbnail
                }
            });
        }
        results.reddit = redditTrends.length;
    } catch (e: any) {
        console.error("Reddit Scraper Error", e);
        results.errors.push(`Reddit: ${e.message}`);
    }

    // 4. Run YouTube Trends
    try {
        const { YouTubeProvider } = await import('@/services/scraper/providers/youtube');
        const youtubeProvider = new YouTubeProvider();
        const youtubeTrends = await youtubeProvider.getTrendingVideos('BR');

        for (const video of youtubeTrends) {
            await trendsService.upsertTrend({
                title: video.title,
                url: video.url,
                category: 'YouTube',
                image: video.thumbnail,
                metadata: {
                    source: 'youtube',
                    views: video.viewCount,
                    channel: video.channelName,
                    published: video.publishedTime
                }
            });
        }
        // results.youtube = youtubeTrends.length; // Need to update TypeScript results type if I want to track this
    } catch (e: any) {
        console.error("YouTube Scraper Error", e);
        results.errors.push(`YouTube: ${e.message}`);
    }

    return NextResponse.json({
        success: true,
        summary: results,
        timestamp: new Date().toISOString()
    });
}
