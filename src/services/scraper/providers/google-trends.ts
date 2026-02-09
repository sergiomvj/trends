import Parser from 'rss-parser';
import axios from 'axios';

interface TrendData {
    title: string;
    traffic: string;
    url: string;
    image?: string;
    publishedDate: string;
    source: string;
}

export class GoogleTrendsProvider {
    private parser: Parser;

    constructor() {
        this.parser = new Parser({
            customFields: {
                item: [
                    ['ht:approx_traffic', 'traffic'],
                    ['ht:picture', 'picture'],
                    ['ht:picture_source', 'pictureSource'],
                    ['ht:news_item', 'newsItems'],
                ],
            },
        });
    }

    /**
     * Fetches daily trends for a specific Geo location using RSS with headers
     * @param geo Country code (default: 'BR')
     */
    async getDailyTrends(geo = 'BR'): Promise<TrendData[]> {
        try {
            // Trying the internal API endpoint directly
            const url = `https://trends.google.com/trends/api/dailytrends?hl=pt-BR&tz=-180&geo=${geo}&ns=15`;

            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/json, text/plain, */*',
                },
                responseType: 'text' // Force text to handle the magic prefix
            });

            // Google keys the response with a magic prefix ")]}',"
            const cleanResponse = response.data.replace(")]}',", "").trim();
            const parsed = JSON.parse(cleanResponse);
            const days = parsed.default.trendingSearchesDays;

            // Flatten all trends from days
            const trends: TrendData[] = [];

            days.forEach((day: any) => {
                day.trendingSearches.forEach((trend: any) => {
                    trends.push({
                        title: trend.title.query,
                        traffic: trend.formattedTraffic,
                        url: `https://google.com/search?q=${encodeURIComponent(trend.title.query)}`,
                        image: trend.image?.imageUrl,
                        publishedDate: day.date,
                        source: 'Google Trends'
                    });
                });
            });

            return trends;

        } catch (error) {
            console.warn('⚠️ Google Trends API failed (likely IP blocked or changed). Returning MOCK data for development.');
            // console.error(error); // Keep logs clean for now

            // Fallback Mock Data
            return [
                {
                    title: "Big Brother Brasil 24",
                    traffic: "2M+",
                    url: "https://google.com/search?q=bbb24",
                    image: "https://s2-g1.glbimg.com/ReXg3y_1X8Jc7wS8z2z9X8Jc7wS8=/0x0:1200x675/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2024/A/B/C/example.jpg",
                    publishedDate: new Date().toISOString(),
                    source: "Google Trends (Mock)"
                },
                {
                    title: "Campeonato Brasileiro",
                    traffic: "1M+",
                    url: "https://google.com/search?q=brasileirao",
                    publishedDate: new Date().toISOString(),
                    source: "Google Trends (Mock)"
                },
                {
                    title: "Dólar hoje",
                    traffic: "500K+",
                    url: "https://google.com/search?q=dolar",
                    publishedDate: new Date().toISOString(),
                    source: "Google Trends (Mock)"
                }
            ];
        }
    }

    /**
     * Fetches Real-time trends (last 24h)
     * Note: Real-time trends RSS is not standard, keeping this placeholder or we need a specific scraper for it.
     * Direct API calls are blocked.
     */
    async getRealTimeTrends(geo = 'BR', category = 'all'): Promise<any[]> {
        console.warn("RealTimeTrends via API is currently blocked. Use getDailyTrends for reliable data.");
        return [];
    }
}
