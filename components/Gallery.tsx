'use client';

import { useState } from 'react';
import Image from 'next/image';
import Masonry from 'react-masonry-css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Artwork } from '../types/artwork';

interface GalleryProps {
  artworks: Artwork[];
}

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export default function Gallery({ artworks }: GalleryProps) {
  const [index, setIndex] = useState(-1);

  const slides = artworks.map((artwork) => ({
    src: artwork.cdnUrl || artwork.imageUrl,
    alt: artwork.title,
  }));

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {artworks.map((artwork, i) => (
          <div key={artwork.id} className="mb-4 cursor-pointer transition-transform hover:scale-105" onClick={() => setIndex(i)}>
            <Image
              src={artwork.cdnUrl || artwork.imageUrl}
              alt={artwork.title}
              width={300}
              height={300}
              className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              style={{ aspectRatio: 'auto' }}
            />
          </div>
        ))}
      </Masonry>

      <Lightbox
        slides={slides}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
      />
    </>
  );
}