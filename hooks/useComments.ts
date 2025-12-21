'use client';

import { useState, useCallback } from 'react';
import { Comment, CommentInput } from '@/types/comment';
import { useCommentsContext } from '@/contexts/CommentsContext';

interface UseCommentsOptions {
    targetId: string;
    targetType: 'artwork' | 'post';
}

export function useComments({ targetId, targetType }: UseCommentsOptions) {
    const context = useCommentsContext();
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // With realtime updates, comments are automatically synced
    const comments = context.getComments(targetId);
    const loading = context.isLoading();

    // Add a comment
    const addComment = async (input: Omit<CommentInput, 'targetId' | 'targetType'>) => {
        try {
            setSubmitting(true);
            const newComment = await context.addComment(targetId, targetType, input);
            return newComment;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add comment');
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    // Toggle like on a comment
    const toggleLike = async (commentId: string) => {
        try {
            return await context.toggleLike(targetId, commentId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to toggle like');
            throw err;
        }
    };

    // Delete a comment
    const deleteComment = async (commentId: string) => {
        try {
            await context.deleteComment(targetId, commentId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete comment');
            throw err;
        }
    };

    // Get top-level comments (no parentId)
    const topLevelComments = context.getTopLevelComments(targetId);

    // Get replies for a comment
    const getReplies = (parentId: string) => context.getReplies(targetId, parentId);

    // Force refetch - with realtime, this is a no-op
    const refetch = useCallback(() => {
        // Realtime updates handle this automatically
    }, []);

    return {
        comments,
        topLevelComments,
        getReplies,
        loading,
        error,
        submitting,
        addComment,
        toggleLike,
        deleteComment,
        hasLiked: context.hasLiked,
        sessionId: context.sessionId,
        refetch,
    };
}
