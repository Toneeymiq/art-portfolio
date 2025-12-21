export interface Comment {
    id: string;
    targetId: string;           // ID of artwork or post
    targetType: 'artwork' | 'post';
    parentId?: string;          // For replies - ID of parent comment
    authorName: string;         // User-provided name or "Anonymous"
    content: string;
    likes: number;
    likedBy: string[];          // Array of session IDs who liked
    createdAt: Date;
    updatedAt?: Date;
}

export interface CommentInput {
    targetId: string;
    targetType: 'artwork' | 'post';
    parentId?: string;
    authorName?: string;        // Optional - defaults to "Anonymous"
    content: string;
}

export interface LikeInput {
    commentId: string;
    sessionId: string;          // Browser session ID for tracking likes
}
