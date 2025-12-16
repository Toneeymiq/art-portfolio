'use client';

import Gallery from '../../components/Gallery';
import FilterButtons from '../../components/FilterButtons';
import { useState } from 'react';
import { Artwork } from '../../types/artwork';

// Mock data for testing UI - expanded with more artworks and varied sizes
const mockArtworks = [
  {
    id: '1',
    title: 'Sunset Landscape',
    description: 'A beautiful painting of a sunset over mountains',
    tags: ['paint', 'landscape'],
    imageUrl: 'https://picsum.photos/600/800?random=1',
    driveId: 'drive1',
    cdnUrl: 'https://picsum.photos/600/800?random=1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Abstract Digital Art',
    description: 'Modern digital abstract composition',
    tags: ['digital', 'abstract'],
    imageUrl: 'https://picsum.photos/400/600?random=2',
    driveId: 'drive2',
    cdnUrl: 'https://picsum.photos/400/600?random=2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Portrait Study',
    description: 'Detailed charcoal portrait',
    tags: ['draw', 'portrait'],
    imageUrl: 'https://picsum.photos/500/700?random=3',
    driveId: 'drive3',
    cdnUrl: 'https://picsum.photos/500/700?random=3',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: 'Cityscape at Night',
    description: 'Urban scene with neon lights',
    tags: ['digital', 'city'],
    imageUrl: 'https://picsum.photos/700/500?random=4',
    driveId: 'drive4',
    cdnUrl: 'https://picsum.photos/700/500?random=4',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    title: 'Floral Still Life',
    description: 'Oil painting of flowers in vase',
    tags: ['paint', 'still-life'],
    imageUrl: 'https://picsum.photos/450/650?random=5',
    driveId: 'drive5',
    cdnUrl: 'https://picsum.photos/450/650?random=5',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    title: 'Geometric Patterns',
    description: 'Vector art with geometric shapes',
    tags: ['digital', 'geometric'],
    imageUrl: 'https://picsum.photos/550/450?random=6',
    driveId: 'drive6',
    cdnUrl: 'https://picsum.photos/550/450?random=6',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    title: 'Fantasy Character',
    description: 'Digital illustration of a fantasy character',
    tags: ['digital', 'fantasy'],
    imageUrl: 'https://picsum.photos/480/720?random=7',
    driveId: 'drive7',
    cdnUrl: 'https://picsum.photos/480/720?random=7',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    title: 'Nature Study',
    description: 'Detailed botanical illustration',
    tags: ['draw', 'nature'],
    imageUrl: 'https://picsum.photos/520/680?random=8',
    driveId: 'drive8',
    cdnUrl: 'https://picsum.photos/520/680?random=8',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '9',
    title: 'Sci-Fi Concept',
    description: 'Futuristic cityscape concept art',
    tags: ['digital', 'sci-fi'],
    imageUrl: 'https://picsum.photos/650/550?random=9',
    driveId: 'drive9',
    cdnUrl: 'https://picsum.photos/650/550?random=9',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '10',
    title: 'Watercolor Portrait',
    description: 'Soft watercolor portrait study',
    tags: ['paint', 'portrait'],
    imageUrl: 'https://picsum.photos/420/580?random=10',
    driveId: 'drive10',
    cdnUrl: 'https://picsum.photos/420/580?random=10',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '11',
    title: 'Minimalist Design',
    description: 'Clean and simple geometric design',
    tags: ['digital', 'minimalist'],
    imageUrl: 'https://picsum.photos/500/500?random=11',
    driveId: 'drive11',
    cdnUrl: 'https://picsum.photos/500/500?random=11',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '12',
    title: 'Animal Study',
    description: 'Detailed wildlife illustration',
    tags: ['draw', 'animals'],
    imageUrl: 'https://picsum.photos/580/420?random=12',
    driveId: 'drive12',
    cdnUrl: 'https://picsum.photos/580/420?random=12',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Portfolio() {
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>(mockArtworks);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">Portfolio</h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            A showcase of my artistic journey through various mediums and styles
          </p>
        </div>

        <div className="mb-8">
          <FilterButtons artworks={mockArtworks} onFilter={setFilteredArtworks} />
        </div>

        <Gallery artworks={filteredArtworks} />
      </div>
    </div>
  );
}