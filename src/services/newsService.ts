
import { NewsArticle } from '../types';
import { NEWS_ARTICLES } from '../constants';

// --- CONFIGURATION ---
// In a production environment, these would be in .env
// const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;
// const NEWS_API_ENDPOINT = 'https://newsapi.ai/api/v1/article/getArticles';

/**
 * Service to handle fetching news from external APIs or local mocks.
 * 
 * FUTURE INTEGRATION GUIDE (NewsAPI.ai):
 * 1. Get an API Key from https://newsapi.ai/
 * 2. Use the endpoint: https://newsapi.ai/api/v1/article/getArticles
 * 3. Payload Body:
 *    {
 *      "query": {
 *        "$query": {
 *          "$or": [
 *            { "keyword": "psilocybin", "keywordLoc": "title" },
 *            { "keyword": "MDMA", "keywordLoc": "title" },
 *            { "keyword": "psychedelic therapy", "keywordLoc": "body" }
 *          ]
 *        },
 *        "$filter": {
 *          "isDuplicate": "skipDuplicates"
 *        }
 *      },
 *      "resultType": "articles",
 *      "articlesSortBy": "date",
 *      "apiKey": NEWS_API_KEY
 *    }
 */

export const NewsService = {
    /**
     * Fetches the latest news articles.
     * Currently returns a Promise that resolves with the mock data.
     * 
     * @returns Promise<NewsArticle[]>
     */
    getLatestNews: async (): Promise<NewsArticle[]> => {
        // SIMULATION: Simulate network latency
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(NEWS_ARTICLES);
            }, 800);
        });
    },

    /**
     * Fetches news by a specific category.
     * Useful for filtering on the backend if the API supports it.
     */
    getNewsByCategory: async (category: string): Promise<NewsArticle[]> => {
        // SIMULATION: Filter the mock data
        return new Promise((resolve) => {
            setTimeout(() => {
                if (category === 'All') {
                    resolve(NEWS_ARTICLES);
                } else {
                    resolve(NEWS_ARTICLES.filter(article => article.category === category));
                }
            }, 500);
        });
    }
};
