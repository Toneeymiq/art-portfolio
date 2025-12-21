import { NextRequest, NextResponse } from 'next/server';
import { getPosts, createPost } from '@/lib/db';
import { ContentStatus } from '@/types/post';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') as ContentStatus | null;
        const limitParam = searchParams.get('limit');

        const posts = await getPosts({
            status: status || undefined,
            limitCount: limitParam ? parseInt(limitParam, 10) : undefined,
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.title || !body.slug || !body.content) {
            return NextResponse.json(
                { error: 'Missing required fields: title, slug, content' },
                { status: 400 }
            );
        }

        const id = await createPost({
            title: body.title,
            slug: body.slug,
            content: body.content,
            linkedArtworkId: body.linkedArtworkId,
            tags: body.tags || [],
            publishDate: body.publishDate || new Date().toISOString().split('T')[0],
            status: body.status || 'draft',
            readTime: body.readTime,
            excerpt: body.excerpt,
        });

        return NextResponse.json({ id }, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}
