import { NextRequest, NextResponse } from 'next/server';
import { getProcessEntries, createProcessEntry } from '@/lib/db';
import { ContentStatus } from '@/types/process';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const visibility = searchParams.get('visibility') as ContentStatus | null;
        const limitParam = searchParams.get('limit');

        const entries = await getProcessEntries({
            visibility: visibility || undefined,
            limitCount: limitParam ? parseInt(limitParam, 10) : undefined,
        });

        return NextResponse.json(entries);
    } catch (error) {
        console.error('Error fetching process entries:', error);
        return NextResponse.json(
            { error: 'Failed to fetch process entries' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.artworkId || !body.youtubeShortUrl) {
            return NextResponse.json(
                { error: 'Missing required fields: artworkId, youtubeShortUrl' },
                { status: 400 }
            );
        }

        const id = await createProcessEntry({
            artworkId: body.artworkId,
            youtubeShortUrl: body.youtubeShortUrl,
            processNotes: body.processNotes || '',
            stepLabels: body.stepLabels || [],
            visibility: body.visibility || 'draft',
        });

        return NextResponse.json({ id }, { status: 201 });
    } catch (error) {
        console.error('Error creating process entry:', error);
        return NextResponse.json(
            { error: 'Failed to create process entry' },
            { status: 500 }
        );
    }
}
