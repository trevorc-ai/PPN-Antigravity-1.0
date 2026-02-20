import { useState, useEffect, useCallback } from 'react';
import { NEWS_ARTICLES } from '../constants';
import { NewsArticle } from '../types';

// RSS2JSON proxy — free, no key, CORS-safe for client-side use
const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url=';

// Reputable psychedelic therapy and clinical research RSS feeds
const LIVE_FEEDS = [
    // PsyPost — peer-reviewed psychedelic research coverage
    'https://www.psypost.org/category/psychedelic-drugs/feed',
    // Psychedelic Alpha — regulatory and clinical trial news
    'https://psychedelicalpha.com/feed',
    // MAPS news (MDMA, clinical trials)
    'https://maps.org/news/feed/',
];

interface RssItem {
    title: string;
    link: string;
    pubDate: string;
    description: string;
    thumbnail?: string;
    enclosure?: { link: string };
    author?: string;
    categories?: string[];
}

interface RssFeed {
    status: string;
    items: RssItem[];
    feed: { title: string; link: string; image: string };
}

function rssItemToArticle(item: RssItem, index: number): NewsArticle {
    const imageUrl =
        item.thumbnail ||
        item.enclosure?.link ||
        `https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800`;

    // Classify category
    const titleLower = item.title.toLowerCase();
    const descLower = (item.description || '').toLowerCase();
    let category: NewsArticle['category'] = 'Industry';
    if (titleLower.includes('fda') || titleLower.includes('dea') || titleLower.includes('regulat') || descLower.includes('regulat')) {
        category = 'Regulation';
    } else if (titleLower.includes('trial') || titleLower.includes('clinical') || titleLower.includes('phase') || titleLower.includes('study')) {
        category = 'Clinical Trials';
    } else if (titleLower.includes('network') || titleLower.includes('partner') || titleLower.includes('ppn')) {
        category = 'Network';
    }

    // Strip HTML from description
    const cleanDesc = (item.description || '')
        .replace(/<[^>]*>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .trim()
        .slice(0, 240);

    const pubDate = new Date(item.pubDate);
    const now = new Date();
    const diffMs = now.getTime() - pubDate.getTime();
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    const diffD = Math.floor(diffH / 24);
    const timestamp =
        diffH < 1 ? 'Just now' :
            diffH < 24 ? `${diffH}h ago` :
                diffD < 7 ? `${diffD}d ago` :
                    pubDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return {
        id: `live-${index}-${Date.now()}`,
        title: item.title,
        summary: cleanDesc || 'Read the full article for details.',
        category,
        source: item.author || 'External Feed',
        timestamp,
        readTime: '3 min read',
        verified: false,
        imageUrl,
        sentiment: 'positive' as const,
        isPartner: false,
        impactScore: Math.floor(Math.random() * 30) + 60, // 60-90 range for live news
        externalUrl: item.link,
    };
}

export function useLiveNews() {
    const [articles, setArticles] = useState<NewsArticle[]>(NEWS_ARTICLES);
    const [liveCount, setLiveCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastFetched, setLastFetched] = useState<Date | null>(null);

    const fetchFeeds = useCallback(async () => {
        setLoading(true);
        setError(null);

        const liveArticles: NewsArticle[] = [];

        await Promise.allSettled(
            LIVE_FEEDS.map(async (feedUrl) => {
                try {
                    const res = await fetch(`${RSS2JSON}${encodeURIComponent(feedUrl)}&count=8`, {
                        signal: AbortSignal.timeout(8000),
                    });
                    if (!res.ok) return;
                    const data: RssFeed = await res.json();
                    if (data.status !== 'ok' || !data.items?.length) return;
                    const mapped = data.items.map((item, i) => rssItemToArticle(item, liveArticles.length + i));
                    liveArticles.push(...mapped);
                } catch {
                    // Silent — fall back to static articles for this feed
                }
            })
        );

        if (liveArticles.length > 0) {
            // Sort live articles by most recent, then append static fallback at the bottom
            const sorted = liveArticles.sort((a, b) =>
                a.timestamp.localeCompare(b.timestamp) * -1
            );
            setArticles([...sorted, ...NEWS_ARTICLES]);
            setLiveCount(liveArticles.length);
        } else {
            // All feeds failed — graceful fallback to static
            setArticles(NEWS_ARTICLES);
            setError('Live feeds unavailable — showing curated articles.');
        }

        setLastFetched(new Date());
        setLoading(false);
    }, []);

    // Fetch on mount, refresh every 30 minutes
    useEffect(() => {
        fetchFeeds();
        const interval = setInterval(fetchFeeds, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchFeeds]);

    return { articles, loading, error, liveCount, lastFetched, refresh: fetchFeeds };
}
