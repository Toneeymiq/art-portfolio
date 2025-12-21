'use client';

import { useState, useEffect, useCallback } from 'react';
import { CommissionInfo } from '@/types/commission';

export function useCommissionInfo() {
    const [info, setInfo] = useState<CommissionInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInfo = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/commissions');
            if (!res.ok) throw new Error('Failed to fetch commission info');

            const data = await res.json();
            setInfo(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInfo();
    }, [fetchInfo]);

    const updateInfo = async (updates: Partial<CommissionInfo>) => {
        const res = await fetch('/api/commissions', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...info, ...updates }),
        });

        if (!res.ok) throw new Error('Failed to update commission info');

        await fetchInfo();
    };

    return {
        info,
        loading,
        error,
        refetch: fetchInfo,
        updateInfo,
    };
}
