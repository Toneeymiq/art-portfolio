'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProcessEntry, ContentStatus } from '@/types/process';

interface UseProcessEntriesOptions {
    visibility?: ContentStatus;
    limit?: number;
}

export function useProcessEntries(options?: UseProcessEntriesOptions) {
    const [entries, setEntries] = useState<ProcessEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEntries = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (options?.visibility) params.set('visibility', options.visibility);
            if (options?.limit) params.set('limit', options.limit.toString());

            const res = await fetch(`/api/process?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch process entries');

            const data = await res.json();
            setEntries(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [options?.visibility, options?.limit]);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const createEntry = async (entry: Omit<ProcessEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
        const res = await fetch('/api/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry),
        });

        if (!res.ok) throw new Error('Failed to create process entry');

        const { id } = await res.json();
        await fetchEntries();
        return id;
    };

    const updateEntry = async (id: string, entry: Partial<ProcessEntry>) => {
        const res = await fetch(`/api/process/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry),
        });

        if (!res.ok) throw new Error('Failed to update process entry');

        await fetchEntries();
    };

    const deleteEntry = async (id: string) => {
        const res = await fetch(`/api/process/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) throw new Error('Failed to delete process entry');

        await fetchEntries();
    };

    return {
        entries,
        loading,
        error,
        refetch: fetchEntries,
        createEntry,
        updateEntry,
        deleteEntry,
    };
}

export function useProcessEntry(id: string | null) {
    const [entry, setEntry] = useState<ProcessEntry | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setEntry(null);
            return;
        }

        const fetchEntry = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`/api/process/${id}`);
                if (!res.ok) throw new Error('Failed to fetch process entry');

                const data = await res.json();
                setEntry(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchEntry();
    }, [id]);

    return { entry, loading, error };
}
