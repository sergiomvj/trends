import axios from 'axios';

export interface FirecrawlScrapeResult {
    success: boolean;
    data: {
        markdown: string;
        content?: string;
        metadata?: {
            title?: string;
            description?: string;
            [key: string]: any;
        };
    };
}

export class FirecrawlProvider {
    private apiUrl: string;

    constructor() {
        // Remove trailing slash if present
        this.apiUrl = (process.env.FIRECRAWL_API_URL || 'http://localhost:3002').replace(/\/$/, '');
    }

    /**
     * Scrapes a single URL to get its content (Markdown/HTML)
     * Useful for analyzing a specific news article or trend source depth.
     */
    async scrape(url: string): Promise<FirecrawlScrapeResult | null> {
        try {
            console.log(`🔥 Firecrawl: Scraping ${url} via ${this.apiUrl}...`);

            const apiKey = process.env.FIRECRAWL_API_KEY;

            const response = await axios.post(`${this.apiUrl}/v1/scrape`, {
                url: url,
                formats: ['markdown'],
                timeout: 30000,
                // pageOptions removed as it might cause 400 if not supported by this version
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                timeout: 30000 // 30s timeout
            });

            if (response.data && response.data.success) {
                return response.data;
            } else {
                console.warn('🔥 Firecrawl returned success=false');
                return null;
            }

        } catch (error: any) {
            console.error('🔥 Firecrawl Error:', error.message);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', JSON.stringify(error.response.data, null, 2));
            }
            return null;
        }
    }

    /**
     * Crawls a domain to find relevant sub-pages
     * Note: This is an async job in Firecrawl usually, simplified here.
     */
    async crawl(url: string, limit = 5): Promise<any> {
        try {
            const response = await axios.post(`${this.apiUrl}/v0/crawl`, {
                url: url,
                limit: limit,
                scrapeOptions: {
                    formats: ['markdown']
                }
            });
            return response.data;
        } catch (error) {
            console.error('🔥 Firecrawl Crawl Error:', error);
            return null;
        }
    }
}
