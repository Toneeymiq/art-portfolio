'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Gallery from '@/components/Gallery';
import HeroSlider from '@/components/HeroSlider';
import { ArrowRight, Sparkles, Calendar, Eye } from 'lucide-react';
import { useSettings, useArtworks, usePosts, useStaff } from '@/hooks';
import { useLightbox } from '@/contexts/LightboxContext';
import { getImageUrl, getAvatarUrl } from '@/lib/utils';
import { Artwork } from '@/types/artwork';
import { HomePageSkeleton } from '@/components/SkeletonLoaders';

export default function Home() {
  const { settings, loading: settingsLoading } = useSettings();
  const { artworks, loading: artworksLoading } = useArtworks({ visibility: 'published' });
  const { posts, loading: postsLoading } = usePosts({ status: 'published', limit: 3 });
  const { staff, loading: staffLoading } = useStaff({ activeOnly: true });
  
  // Global lightbox hook
  const { openLightbox } = useLightbox();

  const loading = settingsLoading || artworksLoading || postsLoading || staffLoading;

  const featuredArtworks = useMemo(() => artworks.slice(0, 8), [artworks]);
  const latestPortfolio = useMemo(() => artworks.slice(0, 3), [artworks]);

  if (loading) {
    return <HomePageSkeleton />;
  }

  const siteTitle = settings?.siteTitle || 'Art Portfolio';
  const siteDescription = settings?.siteDescription || 'Digital artist specializing in concept art and illustrations.';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] gradient-mesh">
      {/* Hero Slider - Full screen, blends with navigation */}
      {featuredArtworks.length > 0 ? (
        <HeroSlider artworks={featuredArtworks} />
      ) : (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)]">
          <div className="text-center px-4">
            <div className="text-8xl mb-6">🎨</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[var(--text-primary)]">
              {siteTitle}
            </h1>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
              Welcome! The gallery is being prepared. Beautiful artwork coming soon.
            </p>
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="relative z-10 -mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Content Overlay */}
          <section className="text-center py-16 animate-fade-in-up">
            <div className="glass rounded-3xl p-8 md:p-12 max-w-4xl mx-auto shadow-2xl gradient-border">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[var(--text-primary)] drop-shadow-sm font-dancing">
                {siteTitle.split(' ').map((word, i, arr) =>
                  i === arr.length - 1 ? <span key={i} className="text-gradient"> {word}</span> : (i === 0 ? word : ` ${word}`)
                )}
              </h1>
              <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-8 leading-relaxed">
                {siteDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/portfolio"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  View Full Portfolio
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/commissions"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[var(--text-primary)] text-[var(--text-primary)] px-6 py-3 rounded-xl font-semibold hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Sparkles className="w-4 h-4" />
                  Commission Me
                </Link>
              </div>
            </div>
          </section>

          {/* Featured Artworks Masonry */}
          {featuredArtworks.length > 0 && (
            <section className="py-16">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3 font-dancing">
                  Featured <span className="text-gradient">Works</span>
                </h2>
                <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
                  A curated selection of my best artwork. Click any piece to see details.
                </p>
              </div>
              <Gallery artworks={featuredArtworks} />
            </section>
          )}
        </div>

        {/* Latest Portfolio Section */}
        {latestPortfolio.length > 0 && (
          <section className="py-16 bg-[var(--bg-secondary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-[var(--text-primary)]">Latest Portfolio</h2>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors font-medium group"
                >
                  View All
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latestPortfolio.map((artwork, index) => (
                  <div
                    key={artwork.id}
                    className="card overflow-hidden group animate-fade-in-up cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => openLightbox(artwork)}
                  >
                    <div className="relative h-52 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageUrl(artwork.cdnUrl, artwork.imageUrl, artwork.id)}
                        alt={artwork.title}
                        className="w-full h-full object-cover transition-all duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* View Icon on Hover */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-50">
                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                        {artwork.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{artwork.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Top Posts Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">Latest Posts</h2>
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors font-medium group"
              >
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            {posts.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Posts Coming Soon</h3>
                <p className="text-[var(--text-secondary)]">Stories and insights are being crafted. Stay tuned!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post, index) => (
                  <Link key={post.id} href={`/posts/${post.slug}`}>
                    <article
                      className="card p-6 group animate-fade-in-up h-full cursor-pointer"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mb-3">
                        <Calendar className="w-3 h-3" />
                        {post.publishDate}
                        {post.readTime && (
                          <span className="ml-auto px-2 py-0.5 bg-[var(--bg-tertiary)] rounded-full">
                            {post.readTime}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{post.excerpt}</p>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Staff Section */}
        {staff.length > 0 && (
          <section className="py-16 bg-[var(--bg-secondary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-10 text-[var(--text-primary)]">
                Our <span className="text-gradient">Team</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-6">
                {staff.map((member, index) => (
                  <div
                    key={member.id}
                    className="card p-6 w-64 text-center group animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-[var(--accent-primary)]/20 group-hover:ring-[var(--accent-primary)]/50 transition-all duration-300">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getAvatarUrl(member.imageUrl, member.id)}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-bold text-[var(--text-primary)] mb-1">{member.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
