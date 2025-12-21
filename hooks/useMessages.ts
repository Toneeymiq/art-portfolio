'use client';

import { useState, useEffect, useCallback } from 'react';
import { ContactMessage } from '@/types/contact';

export function useMessages() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/contact');
            if (!res.ok) throw new Error('Failed to fetch messages');
            const data = await res.json();
            setMessages(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const updateMessageStatus = async (id: string, status: ContactMessage['status']) => {
        try {
            const res = await fetch(`/api/contact/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error('Failed to update message');
            await fetchMessages();
        } catch (err) {
            throw err;
        }
    };

    const deleteMessage = async (id: string) => {
        try {
            const res = await fetch(`/api/contact/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete message');
            await fetchMessages();
        } catch (err) {
            throw err;
        }
    };

    return {
        messages,
        loading,
        error,
        refetch: fetchMessages,
        updateMessageStatus,
        deleteMessage
    };
}
