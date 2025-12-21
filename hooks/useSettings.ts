'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SiteSettings, defaultSiteSettings } from '@/types/settings';

// Client-side cache for settings
let settingsCache: SiteSettings | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let pendingPromise: Promise<SiteSettings | null> | null = null;

export function useSettings() {
    const [settings, setSettings] = useState<SiteSettings | null>(settingsCache);
    const [loading, setLoading] = useState(!settingsCache);
    const [error, setError] = useState<string | null>(null);
    const isMounted = useRef(true);

    const fetchSettings = useCallback(async (force: boolean = false) => {
        // Use cache if valid and not forcing refresh
        const now = Date.now();
        if (!force && settingsCache && (now - lastFetchTime) < CACHE_DURATION) {
            setSettings(settingsCache);
            setLoading(false);
            return settingsCache;
        }

        // Deduplicate concurrent requests
        if (pendingPromise && !force) {
            const result = await pendingPromise;
            if (isMounted.current) {
                setSettings(result);
                setLoading(false);
            }
            return result;
        }

        setLoading(true);
        setError(null);

        pendingPromise = (async () => {
            try {
                const res = await fetch('/api/settings');
                if (!res.ok) throw new Error('Failed to fetch settings');
                const data = await res.json();

                // Update cache
                settingsCache = data;
                lastFetchTime = Date.now();

                return data;
            } catch (err) {
                console.error('Error fetching settings:', err);
                // Return defaults on error
                return { ...defaultSiteSettings, id: 'fallback' } as SiteSettings;
            } finally {
                pendingPromise = null;
            }
        })();

        const result = await pendingPromise;

        if (isMounted.current) {
            setSettings(result);
            setLoading(false);
        }

        return result;
    }, []);

    useEffect(() => {
        isMounted.current = true;
        fetchSettings();

        return () => {
            isMounted.current = false;
        };
    }, [fetchSettings]);

    const updateSettings = async (newSettings: Partial<SiteSettings>) => {
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings),
            });

            if (!res.ok) throw new Error('Failed to update settings');

            // Force refresh cache after update
            settingsCache = null;
            lastFetchTime = 0;
            await fetchSettings(true);
        } catch (err) {
            console.error('Error updating settings:', err);
            throw err;
        }
    };

    return {
        settings,
        loading,
        error,
        updateSettings,
        refetch: () => fetchSettings(true),
    };
}
