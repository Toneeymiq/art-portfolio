'use client';

import { useState } from 'react';
import { Artwork } from '../types/artwork';

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
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => handleFilter(null)}
        className={`px-4 py-2 rounded-full transition-all duration-300 ${
          selectedTag === null
            ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
            : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
        }`}
      >
        All
      </button>
      {allTags.map(tag => (
        <button
          key={tag}
          onClick={() => handleFilter(tag)}
          className={`px-4 py-2 rounded-full transition-all duration-300 ${
            selectedTag === tag
              ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}