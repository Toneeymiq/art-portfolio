'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types/post';
import { Calendar, Clock, ArrowLeft, Tag, Share2 } from 'lucide-react';
import CommentsSection from '@/components/CommentsSection';
import { PostDetailSkeleton } from '@/components/SkeletonLoaders';

export default function PostPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPost() {
            try {
                // Fetch all posts and find by slug
                // Note: In a larger app, we'd fetch by slug from API directly
                const res = await fetch('/api/posts?status=published');
                if (!res.ok) throw new Error('Failed to fetch posts');

                const posts: Post[] = await res.json();

                // Decode slug to handle URL encoding
                const decodedSlug = decodeURIComponent(slug).trim();
                const found = posts.find(p => p.slug.trim() === decodedSlug);

                if (found) {
                    setPost(found);
                } else {
                    console.warn('Post not found for slug:', decodedSlug);
                    setError('Post not found');
                }
            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Failed to load post');
            } finally {
                setLoading(false);
            }
        }

        if (slug) fetchPost();
    }, [slug]);

    if (loading) {
        return <PostDetailSkeleton />;
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] pt-20 pb-16">
                <div className="max-w-3xl mx-auto px-4 text-center py-20">
                    <div className="text-6xl mb-6">📝</div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Post Not Found</h1>
                    <p className="text-[var(--text-secondary)] mb-8">
                        The post you're looking for doesn't exist or has been removed.
                    </p>
                    <Link href="/posts" className="btn-primary inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Posts
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-20 pb-16 gradient-mesh">
            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    href="/posts"
                    className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Posts
                </Link>

                {/* Featured Image */}
                {post.imageUrl && (
                    <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 animate-fade-in">
                        <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Header */}
                <header className="mb-8 animate-fade-in-up">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)] mb-4">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {post.publishDate}
                        </span>
                        {post.readTime && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {post.readTime}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
                            {post.excerpt}
                        </p>
                    )}
                </header>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm rounded-full"
                            >
                                <Tag className="w-3 h-3" />
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div
                        className="text-[var(--text-primary)] leading-relaxed space-y-4"
                        style={{ whiteSpace: 'pre-wrap' }}
                    >
                        {post.content}
                    </div>
                </div>

                {/* Share */}
                <div className="mt-12 pt-8 border-t border-[var(--border-primary)]">
                    <div className="flex items-center justify-between">
                        <span className="text-[var(--text-secondary)]">Share this post</span>
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({ title: post.title, url: window.location.href });
                                } else {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('Link copied to clipboard!');
                                }
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-8 pt-8 border-t border-[var(--border-primary)]">
                    <CommentsSection
                        targetId={post.id}
                        targetType="post"
                    />
                </div>

                {/* Back to Posts CTA */}
                <div className="mt-12 card p-8 text-center">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Enjoyed this post?</h3>
                    <p className="text-[var(--text-secondary)] mb-6">Check out more articles and insights.</p>
                    <Link href="/posts" className="btn-primary inline-flex items-center gap-2">
                        View All Posts
                    </Link>
                </div>
            </article>
        </div>
    );
}
