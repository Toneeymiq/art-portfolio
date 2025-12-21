'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Palette, FileText, Video, Users, Image as ImageIcon } from 'lucide-react';

interface EmptyStateProps {
    type: 'artworks' | 'posts' | 'process' | 'staff' | 'general';
    title?: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
}

const icons: Record<string, ReactNode> = {
    artworks: <Palette className="w-16 h-16" />,
    posts: <FileText className="w-16 h-16" />,
    process: <Video className="w-16 h-16" />,
    staff: <Users className="w-16 h-16" />,
    general: <ImageIcon className="w-16 h-16" />,
};

const defaults: Record<string, { title: string; description: string }> = {
    artworks: {
        title: 'Gallery Coming Soon',
        description: 'Beautiful artwork is being prepared for display. Check back soon!',
    },
    posts: {
        title: 'No Posts Yet',
        description: 'Stories and insights are being crafted. Stay tuned for updates!',
    },
    process: {
        title: 'Process Videos Coming',
        description: 'Behind-the-scenes content is being created. Watch this space!',
    },
    staff: {
        title: 'Meet the Team Soon',
        description: 'Team introductions are on the way.',
    },
    general: {
        title: 'Content Coming Soon',
        description: 'This section is being prepared. Please check back later!',
    },
};

export default function EmptyState({
    type,
    title,
    description,
    actionLabel,
    actionHref
}: EmptyStateProps) {
    const defaultContent = defaults[type] || defaults.general;

    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in-up">
            {/* Animated Icon Container */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full blur-2xl opacity-20 animate-pulse" />
                <div className="relative p-8 bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 rounded-full text-[var(--accent-primary)]">
                    {icons[type]}
                </div>
            </div>

            {/* Text Content */}
            <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3 text-center">
                {title || defaultContent.title}
            </h3>
            <p className="text-[var(--text-secondary)] text-center max-w-md mb-8">
                {description || defaultContent.description}
            </p>

            {/* Decorative Elements */}
            <div className="flex items-center gap-2 mb-8">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-[var(--accent-secondary)] animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>

            {/* Optional Action */}
            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="btn-primary inline-flex items-center gap-2"
                >
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}
