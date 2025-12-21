'use client';

import { useState, useEffect, useCallback } from 'react';
import { Artwork, ArtworkCategory, ContentStatus } from '@/types/artwork';

interface UseArtworksOptions {
    category?: ArtworkCategory;
    visibility?: ContentStatus;
    limit?: number;
}

export function useArtworks(options?: UseArtworksOptions) {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArtworks = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (options?.category) params.set('category', options.category);
            if (options?.visibility) params.set('visibility', options.visibility);
            if (options?.limit) params.set('limit', options.limit.toString());

            const res = await fetch(`/api/artworks?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch artworks');

            const data = await res.json();
            setArtworks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [options?.category, options?.visibility, options?.limit]);

    useEffect(() => {
        fetchArtworks();
    }, [fetchArtworks]);

    const createArtwork = async (artwork: Omit<Artwork, 'id' | 'createdAt' | 'updatedAt'>) => {
        const res = await fetch('/api/artworks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(artwork),
        });

        if (!res.ok) throw new Error('Failed to create artwork');

        const { id } = await res.json();
        await fetchArtworks(); // Refresh list
        return id;
    };

    const updateArtwork = async (id: string, artwork: Partial<Artwork>) => {
        const res = await fetch(`/api/artworks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(artwork),
        });

        if (!res.ok) throw new Error('Failed to update artwork');

        await fetchArtworks(); // Refresh list
    };

    const deleteArtwork = async (id: string) => {
        const res = await fetch(`/api/artworks/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) throw new Error('Failed to delete artwork');

        await fetchArtworks(); // Refresh list
    };

    return {
        artworks,
        loading,
        error,
        refetch: fetchArtworks,
        createArtwork,
        updateArtwork,
        deleteArtwork,
    };
}

export function useArtwork(id: string | null) {
    const [artwork, setArtwork] = useState<Artwork | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setArtwork(null);
            return;
        }

        const fetchArtwork = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`/api/artworks/${id}`);
                if (!res.ok) throw new Error('Failed to fetch artwork');

                const data = await res.json();
                setArtwork(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchArtwork();
    }, [id]);

    return { artwork, loading, error };
}
