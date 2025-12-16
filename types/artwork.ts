export interface Artwork {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  driveId: string;
  cdnUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}