'use client';

import { useState, useEffect, useCallback } from 'react';
import { Post, ContentStatus } from '@/types/post';

interface UsePostsOptions {
    status?: ContentStatus;
    limit?: number;
}

export function usePosts(options?: UsePostsOptions) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (options?.status) params.set('status', options.status);
            if (options?.limit) params.set('limit', options.limit.toString());

            const res = await fetch(`/api/posts?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch posts');

            const data = await res.json();
            setPosts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [options?.status, options?.limit]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const createPost = async (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post),
        });

        if (!res.ok) throw new Error('Failed to create post');

        const { id } = await res.json();
        await fetchPosts();
        return id;
    };

    const updatePost = async (id: string, post: Partial<Post>) => {
        const res = await fetch(`/api/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post),
        });

        if (!res.ok) throw new Error('Failed to update post');

        await fetchPosts();
    };

    const deletePost = async (id: string) => {
        const res = await fetch(`/api/posts/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) throw new Error('Failed to delete post');

        await fetchPosts();
    };

    return {
        posts,
        loading,
        error,
        refetch: fetchPosts,
        createPost,
        updatePost,
        deletePost,
    };
}

export function usePost(id: string | null) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setPost(null);
            return;
        }

        const fetchPost = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`/api/posts/${id}`);
                if (!res.ok) throw new Error('Failed to fetch post');

                const data = await res.json();
                setPost(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    return { post, loading, error };
}
