'use client';

import Masonry from 'react-masonry-css';
import { Eye, Tag } from 'lucide-react';
import { Artwork } from '../types/artwork';
import { useLightbox } from '@/contexts/LightboxContext';
import { getImageUrl } from '@/lib/utils';

interface GalleryProps {
  artworks: Artwork[];
}

const breakpointColumnsObj = {
  default: 3,
  1280: 3,
  1024: 2,
  768: 1,
  640: 1,
};

export default function Gallery({ artworks }: GalleryProps) {
  const { openLightbox } = useLightbox();

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {artworks.map((artwork, index) => (
        <div
          key={artwork.id}
          className="group relative mb-4 cursor-pointer overflow-hidden rounded-xl animate-fade-in-up shadow-sm hover:shadow-xl border border-[var(--border-primary)]/30 dark:border-white/5 transition-all duration-500 ease-out active:scale-[0.98]"
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => openLightbox(artwork)}
        >
          {/* Image Container */}
          <div className="relative overflow-hidden rounded-xl bg-[var(--bg-tertiary)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageUrl(artwork.cdnUrl, artwork.imageUrl, artwork.id)}
              alt={artwork.title}
              className="w-full h-auto object-cover"
              loading="lazy"
            />

            {/* Darken Overlay on Hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-black/20 transition-all duration-300 ease-out" />

            {/* View Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out transform group-hover:scale-100 scale-90">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-xl">
                <Eye className="w-8 h-8 text-white drop-shadow-md" />
              </div>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
              <h3 className="text-white font-bold text-lg mb-1 drop-shadow-md">
                {artwork.title}
              </h3>
              <p className="text-white/80 text-sm mb-3 line-clamp-2">
                {artwork.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {artwork.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 backdrop-blur-md text-white/90 text-xs rounded-full border border-white/10"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative Border */}
          <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[var(--accent-primary)]/50 transition-colors duration-500 pointer-events-none" />
        </div>
      ))}
    </Masonry>
  );
}