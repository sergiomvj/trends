import axios from 'axios';

interface RedditPost {
    title: string;
    url: string;
    score: number;
    numComments: number;
    subreddit: string;
    author: string;
    thumbnail?: string;
    createdUtc: number;
}

export class RedditProvider {
    /**
     * Fetches trending posts from a subreddit
     * @param subreddit Name of the subreddit (e.g., 'technology', 'worldnews')
     * @param listing Type of listing: 'hot', 'new', 'top', 'rising'
     * @param limit Number of items to fetch
     */
    async getTrendingPosts(subreddit: string, listing: 'hot' | 'top' | 'rising' = 'hot', limit = 10): Promise<RedditPost[]> {
        try {
            const url = `https://www.reddit.com/r/${subreddit}/${listing}.json?limit=${limit}`;

            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'FBR-Trends/1.0 (Integration for data intelligence)',
                }
            });

            const children = response.data.data.children;

            return children.map((child: any) => {
                const post = child.data;
                return {
                    title: post.title,
                    url: `https://reddit.com${post.permalink}`,
                    score: post.score,
                    numComments: post.num_comments,
                    subreddit: post.subreddit,
                    author: post.author,
                    thumbnail: post.thumbnail && post.thumbnail.startsWith('http') ? post.thumbnail : undefined,
                    createdUtc: post.created_utc,
                };
            });

        } catch (error) {
            console.error(`Error fetching Reddit trends from r/${subreddit}:`, error);
            return [];
        }
    }

    /**
     * Fetches from a set of popular subreddits to get general trends
     */
    async getGeneralTrends(): Promise<RedditPost[]> {
        const subreddits = ['technology', 'business', 'worldnews', 'artificial', 'marketing'];
        const allPosts: RedditPost[] = [];

        for (const sub of subreddits) {
            const posts = await this.getTrendingPosts(sub, 'rising', 5);
            allPosts.push(...posts);
        }

        return allPosts;
    }
}
