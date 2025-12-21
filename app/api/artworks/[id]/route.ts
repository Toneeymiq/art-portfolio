import { NextRequest, NextResponse } from 'next/server';
import { getArtworkById, updateArtwork, deleteArtwork } from '@/lib/db';
import { cache, CACHE_KEYS } from '@/lib/cache';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const artwork = await getArtworkById(id);

        if (!artwork) {
            return NextResponse.json(
                { error: 'Artwork not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(artwork);
    } catch (error) {
        console.error('Error fetching artwork:', error);
        return NextResponse.json(
            { error: 'Failed to fetch artwork' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Check if artwork exists
        const existing = await getArtworkById(id);
        if (!existing) {
            return NextResponse.json(
                { error: 'Artwork not found' },
                { status: 404 }
            );
        }

        await updateArtwork(id, body);

        // Invalidate artworks cache
        cache.invalidatePrefix(CACHE_KEYS.ARTWORKS);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating artwork:', error);
        return NextResponse.json(
            { error: 'Failed to update artwork' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        // Check if artwork exists
        const existing = await getArtworkById(id);
        if (!existing) {
            return NextResponse.json(
                { error: 'Artwork not found' },
                { status: 404 }
            );
        }

        await deleteArtwork(id);

        // Invalidate artworks cache
        cache.invalidatePrefix(CACHE_KEYS.ARTWORKS);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting artwork:', error);
        return NextResponse.json(
            { error: 'Failed to delete artwork' },
            { status: 500 }
        );
    }
}
