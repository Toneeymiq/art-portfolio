// Simple in-memory cache for reducing Firestore reads
// This helps keep costs low by caching frequently accessed data

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

class SimpleCache {
    private cache: Map<string, CacheEntry<unknown>> = new Map();

    set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttlMs,
        });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        // Check if expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    invalidate(key: string): void {
        this.cache.delete(key);
    }

    invalidatePrefix(prefix: string): void {
        for (const key of this.cache.keys()) {
            if (key.startsWith(prefix)) {
                this.cache.delete(key);
            }
        }
    }

    clear(): void {
        this.cache.clear();
    }
}

// Singleton instance
export const cache = new SimpleCache();

// Cache keys
export const CACHE_KEYS = {
    SETTINGS: 'settings',
    ARTWORKS: 'artworks',
    ARTWORKS_PUBLISHED: 'artworks:published',
    POSTS: 'posts',
    POSTS_PUBLISHED: 'posts:published',
    PROCESS: 'process',
    STAFF: 'staff',
};

// Cache TTL values (in milliseconds)
export const CACHE_TTL = {
    SETTINGS: 10 * 60 * 1000,    // 10 minutes - settings rarely change
    ARTWORKS: 5 * 60 * 1000,     // 5 minutes
    POSTS: 5 * 60 * 1000,        // 5 minutes
    PROCESS: 5 * 60 * 1000,      // 5 minutes
    STAFF: 10 * 60 * 1000,       // 10 minutes
    DEFAULT: 3 * 60 * 1000,      // 3 minutes default
};
