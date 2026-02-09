import Parser from 'rss-parser';

interface RSSItem {
    title: string;
    link: string;
    pubDate: string;
    content: string;
    source: string;
    categories?: string[];
}

export class RSSProvider {
    private parser: Parser;

    constructor() {
        this.parser = new Parser();
    }

    /**
     * Fetches and parses an RSS feed
     * @param url Feed URL
     * @param sourceName name of the source (e.g. 'TechCrunch')
     */
    async getFeed(url: string, sourceName: string): Promise<RSSItem[]> {
        try {
            const feed = await this.parser.parseURL(url);

            return feed.items.map(item => ({
                title: item.title || '',
                link: item.link || '',
                pubDate: item.pubDate || new Date().toISOString(),
                content: item.contentSnippet || item.content || '',
                source: sourceName,
                categories: item.categories
            }));
        } catch (error) {
            console.error(`Error fetching RSS feed from ${url}:`, error);
            return [];
        }
    }
}
