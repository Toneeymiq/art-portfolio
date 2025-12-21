'use client';

import Link from 'next/link';
import Image from 'next/image';
import EmptyState from '@/components/EmptyState';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { useSettings, usePosts } from '@/hooks';
import { getImageUrl } from '@/lib/utils';
import { PostsPageSkeleton } from '@/components/SkeletonLoaders';

export default function Posts() {
  const { settings, loading: settingsLoading } = useSettings();
  const { posts, loading: postsLoading } = usePosts({ status: 'published' });

  const loading = settingsLoading || postsLoading;

  if (loading) {
    return <PostsPageSkeleton />;
  }

  const pageTitle = settings?.postsPageTitle || 'Posts & Insights';
  const pageSubtitle = settings?.postsPageSubtitle || 'Insights, breakdowns, and stories from my creative journey';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-20 pb-16 gradient-mesh">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)]/10 rounded-full text-[var(--accent-primary)] text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Blog & Articles
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)] font-dancing">
            {pageTitle.split(' ').map((word, i, arr) =>
              i === arr.length - 1 ? <span key={i} className="text-gradient"> {word}</span> : (i === 0 ? word : ` ${word}`)
            )}
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            {pageSubtitle}
          </p>
        </div>

        {/* Empty State or Content */}
        {posts.length === 0 ? (
          <EmptyState
            type="posts"
            actionLabel="View Portfolio"
            actionHref="/portfolio"
          />
        ) : (
          <>
            {/* Featured Post */}
            <Link href={`/posts/${posts[0].slug}`}>
              <article
                className="card overflow-hidden mb-12 group animate-fade-in-up cursor-pointer"
                style={{ animationDelay: '100ms' }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {posts[0].imageUrl ? (
                    <div className="relative h-64 lg:h-auto lg:min-h-[300px] overflow-hidden">
                      <Image
                        src={posts[0].imageUrl}
                        alt={posts[0].title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-[var(--accent-primary)] text-white text-xs font-semibold rounded-full">
                          Featured
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-full min-h-[200px] bg-[var(--bg-tertiary)] flex items-center justify-center p-8">
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-[var(--accent-primary)] text-white text-xs font-semibold rounded-full">
                          Featured
                        </span>
                      </div>
                      <div className="text-6xl opacity-20">📝</div>
                    </div>
                  )}
                  <div className="p-6 lg:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {posts[0].publishDate}
                      </span>
                      {posts[0].readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {posts[0].readTime}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors font-dancing">
                      {posts[0].title}
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                      {posts[0].excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 text-[var(--accent-primary)] font-semibold group/btn">
                      Read Full Article
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>

            {/* Other Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.slice(1).map((post, index) => (
                <Link key={post.id} href={`/posts/${post.slug}`}>
                  <article
                    className="card overflow-hidden group animate-fade-in-up cursor-pointer h-full"
                    style={{ animationDelay: `${200 + index * 100}ms` }}
                  >
                    {post.imageUrl && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={getImageUrl(null, post.imageUrl, post.id)}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.publishDate}
                        </span>
                        {post.readTime && (
                          <span className="px-2 py-0.5 bg-[var(--bg-tertiary)] rounded-full">
                            {post.readTime}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[var(--accent-primary)] text-sm font-medium group/btn">
                        Read More
                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <div className="card p-8 md:p-12 text-center bg-gradient-to-br from-[var(--accent-primary)]/5 to-[var(--accent-secondary)]/5">
            <h2 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">
              Stay Updated
            </h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-lg mx-auto">
              Get notified when I publish new articles, tutorials, and behind-the-scenes content.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}