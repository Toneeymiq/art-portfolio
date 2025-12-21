import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, updateSiteSettings, initializeSiteSettings } from '@/lib/db';
import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';
import { SiteSettings } from '@/types/settings';

export async function GET() {
    try {
        // Check cache first
        const cachedSettings = cache.get<SiteSettings>(CACHE_KEYS.SETTINGS);
        if (cachedSettings) {
            return NextResponse.json(cachedSettings, {
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                },
            });
        }

        let settings = await getSiteSettings();

        // Initialize with defaults if not exists
        if (!settings) {
            await initializeSiteSettings();
            settings = await getSiteSettings();
        }

        // Cache the result
        if (settings) {
            cache.set(CACHE_KEYS.SETTINGS, settings, CACHE_TTL.SETTINGS);
        }

        return NextResponse.json(settings, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error('Error fetching site settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch site settings' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        await updateSiteSettings(body);

        // Invalidate cache after update
        cache.invalidate(CACHE_KEYS.SETTINGS);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating site settings:', error);
        return NextResponse.json(
            { error: 'Failed to update site settings' },
            { status: 500 }
        );
    }
}
