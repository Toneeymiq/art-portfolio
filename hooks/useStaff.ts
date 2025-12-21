'use client';

import { useState, useEffect, useCallback } from 'react';
import { StaffMember } from '@/types/staff';

interface UseStaffOptions {
    activeOnly?: boolean;
}

export function useStaff(options?: UseStaffOptions) {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStaff = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (options?.activeOnly) params.set('activeOnly', 'true');

            const res = await fetch(`/api/staff?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch staff');

            const data = await res.json();
            setStaff(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [options?.activeOnly]);

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);

    const createMember = async (member: Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt'>) => {
        const res = await fetch('/api/staff', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(member),
        });

        if (!res.ok) throw new Error('Failed to create staff member');

        const { id } = await res.json();
        await fetchStaff();
        return id;
    };

    const updateMember = async (id: string, member: Partial<StaffMember>) => {
        const res = await fetch(`/api/staff/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(member),
        });

        if (!res.ok) throw new Error('Failed to update staff member');

        await fetchStaff();
    };

    const deleteMember = async (id: string) => {
        const res = await fetch(`/api/staff/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) throw new Error('Failed to delete staff member');

        await fetchStaff();
    };

    return {
        staff,
        loading,
        error,
        refetch: fetchStaff,
        createMember,
        updateMember,
        deleteMember,
    };
}
