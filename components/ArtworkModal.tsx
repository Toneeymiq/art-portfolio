'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, Calendar, Eye, ExternalLink } from 'lucide-react';
import { Artwork } from '../types/artwork';
import { getImageUrl } from '@/lib/utils';

interface ArtworkModalProps {
    artwork: Artwork | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ArtworkModal({ artwork, isOpen, onClose }: ArtworkModalProps) {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !artwork) return null;

    const formattedDate = artwork.createdAt instanceof Date
        ? artwork.createdAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'Unknown date';

    return (
        <div
            className="fixed top-16 left-0 right-0 bottom-0 z-[100] overflow-y-auto bg-black/95 backdrop-blur-md animate-fade-in"
        >
            {/* Close Button - Fixed to viewport for accessibility */}
            <button
                onClick={onClose}
                className="fixed top-20 left-6 z-[120] p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all duration-300 backdrop-blur-sm group"
                aria-label="Close modal"
            >
                <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
            </button>

            {/* Scrollable Content Wrapper */}
            <div
                className="min-h-full w-full flex items-center justify-center p-4 sm:p-8 pt-8 pb-12"
                onClick={onClose} // Clicking backdrop closes
            >
                <div
                    className="relative w-full max-w-7xl bg-[var(--bg-primary)] rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
                    onClick={(e) => e.stopPropagation()} // Clicking content doesn't close
                >
                    {/* Image Section - Centered and Large */}
                    <div className="relative w-full bg-[var(--bg-tertiary)] flex justify-center items-center min-h-[50vh] md:min-h-[70vh]">
                        <div className="w-full h-[85vh] max-h-[90vh] flex items-center justify-center p-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={getImageUrl(artwork.cdnUrl, artwork.imageUrl, artwork.id)}
                                alt={artwork.title}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Details Section - Below Image */}
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                            {/* Title & Meta - Left Side */}
                            <div className="flex-1">
                                <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
                                    {artwork.title}
                                </h2>
                                <div className="flex flex-wrap items-center gap-4 text-[var(--text-secondary)]">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formattedDate}</span>
                                    </div>
                                    {artwork.medium && (
                                        <>
                                            <span className="w-1 h-1 bg-[var(--text-tertiary)] rounded-full" />
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] rounded-lg text-sm font-medium">
                                                    {artwork.medium}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                    <span className="w-1 h-1 bg-[var(--text-tertiary)] rounded-full" />
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        <span>{artwork.category}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions - Right Side (Desktop) or Bottom (Mobile) */}
                            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                                <Link
                                    href="/process"
                                    className="btn-primary flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                                >
                                    <Eye className="w-5 h-5" />
                                    View Process
                                </Link>
                                <button
                                    onClick={() => window.open(getImageUrl(artwork.cdnUrl, artwork.imageUrl, artwork.id), '_blank')}
                                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 border-2 border-[var(--border-primary)] text-[var(--text-primary)] px-6 py-3 rounded-xl font-semibold hover:bg-[var(--bg-secondary)] transition-all"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    Original
                                </button>
                            </div>
                        </div>

                        {/* Description & Tags */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">About this piece</h3>
                                <p className="text-lg text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                                    {artwork.description}
                                </p>
                            </div>

                            <div className="md:col-span-1 space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                                        Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(artwork.tags || []).map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center px-3 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-default"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
