'use client';

import { useState } from 'react';
import { useMessages } from '@/hooks/useMessages';
import {
    Mail,
    Trash2,
    CheckCircle,
    Clock,
    AlertCircle,
    User,
    Calendar,
    ChevronDown,
    ChevronUp,
    ExternalLink
} from 'lucide-react';
import { AdminMessagesSkeleton } from '@/components/SkeletonLoaders';

export default function MessagesAdmin() {
    const { messages, loading, error, updateMessageStatus, deleteMessage } = useMessages();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
        if (expandedId !== id) {
            const msg = messages.find(m => m.id === id);
            if (msg && msg.status === 'new') {
                updateMessageStatus(id, 'read');
            }
        }
    };

    if (loading) {
        return <AdminMessagesSkeleton />;
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Messages</h1>
                    <p className="text-[var(--text-secondary)]">Manage contact form submissions</p>
                </div>
                <div className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] px-4 py-2 rounded-full text-sm font-semibold">
                    {messages.length} Total Messages
                </div>
            </div>

            {messages.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-[var(--text-tertiary)]" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No messages yet</h3>
                    <p className="text-[var(--text-secondary)]">When people contact you, their messages will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`card overflow-hidden transition-all duration-300 ${message.status === 'new' ? 'border-l-4 border-l-[var(--accent-primary)]' : ''
                                }`}
                        >
                            <div
                                className="p-4 md:p-6 cursor-pointer hover:bg-[var(--bg-secondary)]/50 transition-colors"
                                onClick={() => toggleExpand(message.id)}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${message.status === 'new'
                                                ? 'bg-[var(--accent-primary)] text-white'
                                                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                                            }`}>
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className={`font-bold ${message.status === 'new' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                                                    {message.name}
                                                </h3>
                                                {message.status === 'new' && (
                                                    <span className="px-2 py-0.5 bg-[var(--accent-primary)] text-white text-[10px] uppercase font-bold rounded-full">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)]">{message.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 justify-between md:justify-end">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-medium text-[var(--text-primary)]">{message.subject}</p>
                                            <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)] mt-1 justify-end">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(message.createdAt!).toLocaleDateString()}
                                                <Clock className="w-3 h-3 ml-2" />
                                                {new Date(message.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {expandedId === message.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {expandedId === message.id && (
                                <div className="px-4 pb-6 md:px-6 md:pb-8 border-t border-[var(--border-primary)] pt-6 bg-[var(--bg-secondary)]/30 animate-fade-in">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-[var(--text-primary)]">Subject: {message.subject}</h4>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateMessageStatus(message.id, message.status === 'archived' ? 'read' : 'archived');
                                                    }}
                                                    className={`p-2 rounded-lg transition-colors ${message.status === 'archived'
                                                            ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                                                            : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-primary)]'
                                                        }`}
                                                    title={message.status === 'archived' ? 'Unarchive' : 'Archive'}
                                                >
                                                    <Clock className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (confirm('Are you sure you want to delete this message?')) {
                                                            deleteMessage(message.id);
                                                        }
                                                    }}
                                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-primary)] text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                                            {message.message}
                                        </div>
                                        <div className="flex justify-start">
                                            <a
                                                href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                                                className="btn-primary inline-flex items-center gap-2"
                                            >
                                                <Mail className="w-4 h-4" />
                                                Reply via Email
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
