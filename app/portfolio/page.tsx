'use client';

import Gallery from '@/components/Gallery';
import FilterButtons from '@/components/FilterButtons';
import EmptyState from '@/components/EmptyState';
import { useState, useEffect, useMemo } from 'react';
import { useSettings, useArtworks } from '@/hooks';
import { Grid3X3, LayoutGrid } from 'lucide-react';
import { PortfolioPageSkeleton } from '@/components/SkeletonLoaders';

export default function Portfolio() {
  const { settings, loading: settingsLoading } = useSettings();
  const { artworks, loading: artworksLoading } = useArtworks({ visibility: 'published' });
  const [filteredArtworks, setFilteredArtworks] = useState(artworks);

  // Sync filtered artworks when main list loads
  useEffect(() => {
    if (artworks) {
      setFilteredArtworks(artworks);
    }
  }, [artworks]);

  const loading = settingsLoading || artworksLoading;

  if (loading) {
    return <PortfolioPageSkeleton />;
  }

  // Fallback to default titles if settings not loaded for some reason
  const pageTitle = settings?.portfolioPageTitle || 'My Portfolio';
  const pageSubtitle = settings?.portfolioPageSubtitle || 'A showcase of my artistic journey through various mediums and styles.';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-20 pb-16 gradient-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)]/10 rounded-full text-[var(--accent-primary)] text-sm font-medium mb-4">
            <Grid3X3 className="w-4 h-4" />
            Gallery
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
        {artworks.length === 0 ? (
          <EmptyState
            type="artworks"
            actionLabel="Contact for Commission"
            actionHref="/contact"
          />
        ) : (
          <>
            {/* Filter & View Controls */}
            <div className="mb-10 p-4 card animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <FilterButtons artworks={artworks} onFilter={setFilteredArtworks} />
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <LayoutGrid className="w-4 h-4" />
                  Showing {filteredArtworks.length} of {artworks.length} works
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <Gallery artworks={filteredArtworks} />
            </div>

            {/* Empty Filter State */}
            {filteredArtworks.length === 0 && artworks.length > 0 && (
              <div className="text-center py-16">
                <p className="text-[var(--text-secondary)] text-lg">
                  No artworks found with the selected filter.
                </p>
                <button
                  onClick={() => setFilteredArtworks(artworks)}
                  className="mt-4 text-[var(--accent-primary)] hover:underline font-medium"
                >
                  Clear Filter
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}