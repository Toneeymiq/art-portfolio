export type ContentStatus = 'draft' | 'published';

export interface ProcessEntry {
    id: string;
    artworkId: string; // Linked Artwork
    youtubeShortUrl: string;
    processNotes: string;
    stepLabels?: string[]; // Optional array
    visibility: ContentStatus;

    createdAt: Date;
    updatedAt: Date;
}
