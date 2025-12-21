import { Artwork } from './artwork';

export type ContentStatus = 'draft' | 'published';

export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string; // Markdown or rich text
    imageUrl?: string; // Optional featured image
    linkedArtworkId?: string; // Optional linkage
    tags: string[];
    publishDate: string;
    status: ContentStatus;

    // Display helpers
    readTime?: string;
    excerpt?: string;

    createdAt?: Date;
    updatedAt?: Date;
}
