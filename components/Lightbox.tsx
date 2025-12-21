'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Calendar, Tag, Play, ChevronDown, ChevronUp, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useLightbox } from '@/contexts/LightboxContext';
import { getImageUrl } from '@/lib/utils';
import CommentsSection from './CommentsSection';

/**
 * Extracts YouTube video ID from various URL formats
 */
function getYouTubeVideoId(url: string): string | null {
    if (!url) return null;
    
    // Handle youtu.be/ID format
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) return shortMatch[1];
    
    // Handle youtube.com/shorts/ID format
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch) return shortsMatch[1];
    
    // Handle youtube.com/watch?v=ID format
    const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) return watchMatch[1];
    
    // Handle youtube.com/embed/ID format
    const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (embedMatch) return embedMatch[1];
    
    // If it's already just an ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    
    return null;
}

export default function GlobalLightbox() {
    const { isOpen, artwork, closeLightbox } = useLightbox();
    const [showProcess, setShowProcess] = useState(false);
    const [mounted, setMounted] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    
    // Zoom state
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imageContainerRef = useRef<HTMLDivElement>(null);

    // Handle mounting for portal
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Reset process view when artwork changes
    useEffect(() => {
        setShowProcess(false);
        // Reset zoom when artwork changes
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    }, [artwork?.id]);

    // Zoom functions
    const handleZoomIn = useCallback(() => {
        setZoom(prev => Math.min(prev + 0.5, 4));
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoom(prev => {
            const newZoom = Math.max(prev - 0.5, 1);
            if (newZoom === 1) setPosition({ x: 0, y: 0 });
            return newZoom;
        });
    }, []);

    const handleResetZoom = useCallback(() => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    }, []);

    // Handle mouse wheel zoom
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            setZoom(prev => Math.min(prev + 0.25, 4));
        } else {
            setZoom(prev => {
                const newZoom = Math.max(prev - 0.25, 1);
                if (newZoom === 1) setPosition({ x: 0, y: 0 });
                return newZoom;
            });
        }
    }, []);

    // Handle drag for panning when zoomed
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (zoom > 1) {
            e.preventDefault();
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    }, [zoom, position]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isDragging && zoom > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    }, [isDragging, zoom, dragStart]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Double click to toggle zoom
    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (zoom === 1) {
            setZoom(2);
        } else {
            setZoom(1);
            setPosition({ x: 0, y: 0 });
        }
    }, [zoom]);

    // Close on escape key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') closeLightbox();
    }, [closeLightbox]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleKeyDown]);

    // Handle backdrop click - close only if clicking outside content
    const handleBackdropClick = useCallback((e: React.MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
            closeLightbox();
        }
    }, [closeLightbox]);

    if (!mounted || !isOpen || !artwork) return null;

    const imageUrl = getImageUrl(artwork.cdnUrl, artwork.imageUrl, artwork.id);
    const youtubeId = artwork.youtubeShortUrl ? getYouTubeVideoId(artwork.youtubeShortUrl) : null;
    
    const formattedDate = artwork.createdAt instanceof Date
        ? artwork.createdAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
        : '';

    const lightboxContent = (
        <div 
            className="fixed inset-0 z-[9999] bg-white dark:bg-black/80 backdrop-blur-xl animate-fade-in"
            onClick={handleBackdropClick}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
            {/* Close Button - Top Right */}
            <button
                onClick={closeLightbox}
                className="fixed top-4 right-4 z-[10000] p-3 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-[var(--text-primary)] rounded-full transition-all duration-200 group"
                aria-label="Close"
            >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Zoom Controls - Top Center */}
            <div 
                className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full shadow-lg border border-black/10 dark:border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                    disabled={zoom <= 1}
                    className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 dark:text-gray-200"
                    aria-label="Zoom out"
                >
                    <ZoomOut className="w-5 h-5" />
                </button>
                <span className="text-sm font-semibold min-w-[3rem] text-center text-gray-800 dark:text-white">
                    {Math.round(zoom * 100)}%
                </span>
                <button
                    onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                    disabled={zoom >= 4}
                    className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 dark:text-gray-200"
                    aria-label="Zoom in"
                >
                    <ZoomIn className="w-5 h-5" />
                </button>
                {zoom > 1 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); handleResetZoom(); }}
                        className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors ml-1 text-gray-700 dark:text-gray-200"
                        aria-label="Reset zoom"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Open Original - Top Left */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    window.open(imageUrl, '_blank');
                }}
                className="fixed top-4 left-4 z-[10000] px-4 py-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-[var(--text-primary)] rounded-full transition-all duration-200 flex items-center gap-2 text-sm font-medium"
            >
                <ExternalLink className="w-4 h-4" />
                Open Original
            </button>

            {/* Main Content Container */}
            <div 
                ref={contentRef}
                className="w-full h-full flex flex-col overflow-y-auto"
            >
                {/* Image Container - clicking here closes lightbox */}
                <div 
                    ref={imageContainerRef}
                    className={`flex-1 flex items-center justify-center p-0 md:p-4 pt-14 md:pt-16 pb-4 min-h-[50vh] overflow-hidden ${zoom > 1 ? 'cursor-grab' : 'cursor-zoom-in'} ${isDragging ? 'cursor-grabbing' : ''}`}
                    onClick={zoom === 1 ? closeLightbox : undefined}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt={artwork.title}
                        className="w-full md:max-w-full max-h-full object-contain md:rounded-lg shadow-2xl select-none transition-all duration-300 ease-out animate-scale-in"
                        style={{
                            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                            transformOrigin: 'center center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={handleDoubleClick}
                        draggable={false}
                    />
                </div>

                {/* Info Bar - Bottom */}
                <div 
                    className="bg-[var(--bg-secondary)] backdrop-blur-md border-t border-[var(--border-primary)] px-6 py-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="max-w-6xl mx-auto">
                        {/* Title Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                                {artwork.title}
                            </h2>
                            
                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
                                {formattedDate && (
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        {formattedDate}
                                    </span>
                                )}
                                {artwork.medium && (
                                    <span className="px-2 py-0.5 bg-[var(--bg-tertiary)] rounded-full text-[var(--text-primary)]">
                                        {artwork.medium}
                                    </span>
                                )}
                                <span className="px-2 py-0.5 bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] rounded-full">
                                    {artwork.category}
                                </span>
                            </div>
                        </div>

                        {/* Description & Tags Row */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:items-start mb-4">
                            {artwork.description && (
                                <p className="text-[var(--text-secondary)] text-sm flex-1">
                                    {artwork.description}
                                </p>
                            )}
                            
                            {artwork.tags && artwork.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 sm:justify-end shrink-0">
                                    {artwork.tags.slice(0, 5).map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] text-xs rounded-full"
                                        >
                                            <Tag className="w-3 h-3" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Process Toggle Button */}
                        {artwork.hasProcess && (youtubeId || artwork.processDescription) && (
                            <button
                                onClick={() => setShowProcess(!showProcess)}
                                className="w-full py-3 px-4 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-primary)]/10 border border-[var(--border-primary)] rounded-lg flex items-center justify-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all duration-200 group mb-4"
                            >
                                <Play className="w-4 h-4" />
                                <span className="font-medium">
                                    {showProcess ? 'Hide Process' : 'View Process'}
                                </span>
                                {showProcess ? (
                                    <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                                )}
                            </button>
                        )}

                        {/* Comments Section */}
                        <div className="border-t border-[var(--border-primary)] pt-4">
                            <CommentsSection
                                targetId={artwork.id}
                                targetType="artwork"
                            />
                        </div>
                    </div>
                </div>

                {/* Process Content - Expandable */}
                {showProcess && artwork.hasProcess && (
                    <div 
                        className="bg-[var(--bg-tertiary)] border-t border-[var(--border-primary)] px-6 py-6 animate-fade-in-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="max-w-4xl mx-auto">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                <Play className="w-5 h-5 text-[var(--accent-primary)]" />
                                Process Breakdown
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* YouTube Short Embed */}
                                {youtubeId && (
                                    <div className="aspect-[9/16] max-h-[400px] w-full md:w-auto md:aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-xl">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                                            title="Process Video"
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                )}
                                
                                {/* Process Description */}
                                {artwork.processDescription && (
                                    <div className="flex flex-col justify-center">
                                        <h4 className="text-[var(--text-primary)] font-medium mb-3">About this piece</h4>
                                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed whitespace-pre-wrap">
                                            {artwork.processDescription}
                                        </p>
                                    </div>
                                )}

                                {/* Fallback if only YouTube, no description */}
                                {youtubeId && !artwork.processDescription && (
                                    <div className="flex flex-col justify-center text-center md:text-left">
                                        <p className="text-[var(--text-tertiary)] text-sm">
                                            Watch the creation process for this artwork.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Use portal to render at document root level
    return createPortal(lightboxContent, document.body);
}
