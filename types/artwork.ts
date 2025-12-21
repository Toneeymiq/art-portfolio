export type ArtworkCategory = 'Personal' | 'Commissioned' | 'Concept/Game Art';
export type ContentStatus = 'draft' | 'published';
export type ArtworkMedium = 'Painting' | 'Drawing' | 'Photography' | 'Digital' | 'Sculpture' | 'Mixed Media';

export interface Artwork {
  id: string;
  title: string;
  category: ArtworkCategory;
  medium?: ArtworkMedium;
  imageUrl: string;
  thumbnailUrl?: string; // Optional
  description: string;
  tags: string[];
  hasProcess: boolean;
  youtubeShortUrl?: string;
  processDescription?: string; // Description text for the process
  visibility: ContentStatus;

  // Legacy fields to keep for compatibility/migration if needed, or remove if doing clean break
  driveId?: string;
  cdnUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}