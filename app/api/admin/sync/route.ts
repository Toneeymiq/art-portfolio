import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cache, CACHE_KEYS } from '@/lib/cache';

export async function POST(request: NextRequest) {
    try {
        // Clear in-memory cache
        cache.invalidatePrefix(CACHE_KEYS.ARTWORKS);
        cache.invalidatePrefix(CACHE_KEYS.POSTS);

        // Revalidate all pages
        revalidatePath('/', 'layout');

        return NextResponse.json({ success: true, message: 'Site synced successfully' });
    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json(
            { error: 'Failed to sync site' },
            { status: 500 }
        );
    }
}
