import { NextRequest, NextResponse } from 'next/server';
import { getArtworks, createArtwork } from '@/lib/db';
import { ContentStatus, ArtworkCategory, Artwork } from '@/types/artwork';
import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') as ArtworkCategory | null;
        const visibility = searchParams.get('visibility') as ContentStatus | null;
        const limitParam = searchParams.get('limit');

        // Generate cache key based on query params
        const cacheKey = `${CACHE_KEYS.ARTWORKS}:${visibility || 'all'}:${category || 'all'}:${limitParam || 'all'}`;

        // Check cache first (only for published content to ensure admin sees fresh data)
        if (visibility === 'published') {
            const cachedArtworks = cache.get<Artwork[]>(cacheKey);
            if (cachedArtworks) {
                return NextResponse.json(cachedArtworks, {
                    headers: {
                        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                    },
                });
            }
        }

        const artworks = await getArtworks({
            category: category || undefined,
            visibility: visibility || undefined,
            limitCount: limitParam ? parseInt(limitParam, 10) : undefined,
        });

        // Cache published content only
        if (visibility === 'published') {
            cache.set(cacheKey, artworks, CACHE_TTL.ARTWORKS);
        }

        return NextResponse.json(artworks, {
            headers: visibility === 'published'
                ? { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
                : { 'Cache-Control': 'no-cache' },
        });
    } catch (error) {
        console.error('Error fetching artworks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch artworks' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.title || !body.imageUrl || !body.category) {
            return NextResponse.json(
                { error: 'Missing required fields: title, imageUrl, category' },
                { status: 400 }
            );
        }

        const id = await createArtwork({
            title: body.title,
            description: body.description || '',
            category: body.category,
            imageUrl: body.imageUrl,
            thumbnailUrl: body.thumbnailUrl,
            cdnUrl: body.cdnUrl,
            tags: body.tags || [],
            hasProcess: body.hasProcess || false,
            youtubeShortUrl: body.youtubeShortUrl,
            visibility: body.visibility || 'draft',
        });

        // Invalidate artworks cache
        cache.invalidatePrefix(CACHE_KEYS.ARTWORKS);

        return NextResponse.json({ id }, { status: 201 });
    } catch (error) {
        console.error('Error creating artwork:', error);
        return NextResponse.json(
            { error: 'Failed to create artwork' },
            { status: 500 }
        );
    }
}
