import axios from 'axios';
import * as cheerio from 'cheerio';

interface YouTubeTrend {
    title: string;
    url: string;
    thumbnail: string;
    viewCount: string;
    channelName: string;
    publishedTime: string;
}

export class YouTubeProvider {
    /**
     * Scrapes YouTube Trending page for a specific region
     * @param region Region code (default: 'BR')
     */
    async getTrendingVideos(region = 'BR'): Promise<YouTubeTrend[]> {
        try {
            // YouTube Trending page for a specific region
            const url = `https://www.youtube.com/feed/trending?gl=${region}`;

            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                }
            });

            // YouTube uses heavy JS rendering. The trending data is often inside a script tag `ytInitialData`.
            const html = response.data;
            const $ = cheerio.load(html);

            // Look for the initial data script
            let initialData: any = null;
            $('script').each((_, element) => {
                const text = $(element).text();
                if (text.includes('var ytInitialData =')) {
                    // Use a more robust regex to extract the JSON object
                    const match = text.match(/var ytInitialData = ({.*?});/s);
                    if (match && match[1]) {
                        try {
                            initialData = JSON.parse(match[1]);
                        } catch (e) {
                            // If regex fails with complex nested objects, try manual index search
                            try {
                                const start = text.indexOf('var ytInitialData = ') + 'var ytInitialData = '.length;
                                const end = text.lastIndexOf(';');
                                const potentialJson = text.substring(start, end).trim();
                                initialData = JSON.parse(potentialJson);
                            } catch (innerE) {
                                console.error('Failed to parse YouTube JSON even with fallback:', innerE);
                            }
                        }
                    }
                }
            });

            if (!initialData) {
                console.warn('Could not find ytInitialData on YouTube trending page.');
                return [];
            }

            const trends: YouTubeTrend[] = [];

            // Helper function to recursively find videoRenderer items
            const findVideos = (obj: any) => {
                if (!obj || typeof obj !== 'object') return;

                if (obj.videoRenderer) {
                    const video = obj.videoRenderer;
                    trends.push({
                        title: video.title?.runs?.[0]?.text || video.title?.simpleText || 'Unknown Title',
                        url: `https://www.youtube.com/watch?v=${video.videoId}`,
                        thumbnail: video.thumbnail?.thumbnails?.slice(-1)[0]?.url || '',
                        viewCount: video.viewCountText?.simpleText || video.shortViewCountText?.simpleText || 'N/A',
                        channelName: video.ownerText?.runs?.[0]?.text || '',
                        publishedTime: video.publishedTimeText?.simpleText || 'N/A',
                    });
                    return;
                }

                for (const key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        findVideos(obj[key]);
                    }
                }
            };

            findVideos(initialData);

            if (trends.length === 0) {
                throw new Error('No videos found in ytInitialData');
            }

            return trends;

        } catch (error) {
            console.warn(`⚠️ YouTube scraping failed for region ${region}. Returning MOCK data.`);
            return [
                {
                    title: "RESUMO BBB 24: TUDO O QUE ROLOU NA FESTA",
                    url: "https://www.youtube.com/watch?v=mock1",
                    thumbnail: "https://i.ytimg.com/vi/example1/hqdefault.jpg",
                    viewCount: "1.2M visualizações",
                    channelName: "Big Brother Brasil",
                    publishedTime: "há 2 horas"
                },
                {
                    title: "GOLS DA RODADA | CAMPEONATO BRASILEIRO 2026",
                    url: "https://www.youtube.com/watch?v=mock2",
                    thumbnail: "https://i.ytimg.com/vi/example2/hqdefault.jpg",
                    viewCount: "850K visualizações",
                    channelName: "GE",
                    publishedTime: "há 5 horas"
                },
                {
                    title: "COMO USAR IA PARA CRIAR TRENDS VIRAIS",
                    url: "https://www.youtube.com/watch?v=mock3",
                    thumbnail: "https://i.ytimg.com/vi/example3/hqdefault.jpg",
                    viewCount: "500K visualizações",
                    channelName: "FBR Tech",
                    publishedTime: "há 1 dia"
                }
            ];
        }
    }
}
