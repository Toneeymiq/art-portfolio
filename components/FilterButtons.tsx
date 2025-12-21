'use client';

import { useState } from 'react';
import { Artwork } from '../types/artwork';
import { Filter } from 'lucide-react';

interface FilterButtonsProps {
  artworks: Artwork[];
  onFilter: (filtered: Artwork[]) => void;
}

export default function FilterButtons({ artworks, onFilter }: FilterButtonsProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(artworks.flatMap(art => art.tags)));

  const handleFilter = (tag: string | null) => {
    setSelectedTag(tag);
    if (tag) {
      onFilter(artworks.filter(art => art.tags.includes(tag)));
    } else {
      onFilter(artworks);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filter:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilter(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${selectedTag === null
              ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-lg scale-105'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:scale-105'
            }`}
        >
          All ({artworks.length})
        </button>
        {allTags.map((tag, index) => {
          const count = artworks.filter(art => art.tags.includes(tag)).length;
          return (
            <button
              key={tag}
              onClick={() => handleFilter(tag)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 animate-fade-in-up ${selectedTag === tag
                  ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-lg scale-105'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:scale-105'
                }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)} ({count})
            </button>
          );
        })}
      </div>
    </div>
  );
}