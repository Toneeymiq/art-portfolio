'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
    Image as ImageIcon, 
    FileText, 
    Play, 
    Eye, 
    EyeOff, 
    Plus, 
    Edit, 
    Trash2, 
    Search,
    ChevronUp,
    ChevronDown,
    CheckCircle,
    Clock,
    MessageCircle,
    Heart
} from 'lucide-react';
import { useArtworks, usePosts } from '@/hooks';
import { useCommentsContext } from '@/contexts/CommentsContext';
import { getImageUrl } from '@/lib/utils';
import { AdminDashboardSkeleton } from '@/components/SkeletonLoaders';

type SortField = 'title' | 'createdAt' | 'category' | 'visibility';
type SortDirection = 'asc' | 'desc';

export default function AdminDashboard() {
    const { artworks, loading: artworksLoading, deleteArtwork } = useArtworks({});
    const { posts, loading: postsLoading } = usePosts({});
    const { allComments, allCommentsLoading, deleteComment: deleteCommentFromContext } = useCommentsContext();
    
    // Comments are now realtime - no need to fetch manually
    
    // Filters and sorting
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [processFilter, setProcessFilter] = useState<'all' | 'with' | 'without'>('all');
    const [sortField, setSortField] = useState<SortField>('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const loading = artworksLoading || postsLoading;

    // Handle comment deletion
    const handleDeleteComment = async (commentId: string, targetId: string) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            await deleteCommentFromContext(targetId, commentId);
            // Realtime updates will automatically refresh the list
        }
    };

    // Calculate stats
    const stats = useMemo(() => {
        const publishedArtworks = artworks.filter(a => a.visibility === 'published').length;
        const draftArtworks = artworks.filter(a => a.visibility === 'draft').length;
        const withProcess = artworks.filter(a => a.hasProcess).length;
        const publishedPosts = posts.filter(p => p.status === 'published').length;
        const draftPosts = posts.filter(p => p.status === 'draft').length;
        const artworkComments = allComments.filter(c => c.targetType === 'artwork').length;
        const postComments = allComments.filter(c => c.targetType === 'post').length;
        const totalLikes = allComments.reduce((sum, c) => sum + (c.likes || 0), 0);

        return {
            totalArtworks: artworks.length,
            publishedArtworks,
            draftArtworks,
            withProcess,
            totalPosts: posts.length,
            publishedPosts,
            draftPosts,
            totalComments: allComments.length,
            artworkComments,
            postComments,
            totalLikes,
        };
    }, [artworks, posts, allComments]);

    // Filter and sort artworks
    const filteredArtworks = useMemo(() => {
        let filtered = [...artworks];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(a => 
                a.title.toLowerCase().includes(query) ||
                a.tags?.some(t => t.toLowerCase().includes(query)) ||
                a.category?.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(a => a.visibility === statusFilter);
        }

        // Process filter
        if (processFilter === 'with') {
            filtered = filtered.filter(a => a.hasProcess);
        } else if (processFilter === 'without') {
            filtered = filtered.filter(a => !a.hasProcess);
        }

        // Sort
        filtered.sort((a, b) => {
            let comparison = 0;
            
            switch (sortField) {
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'createdAt':
                    const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
                    const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
                    comparison = dateA - dateB;
                    break;
                case 'category':
                    comparison = (a.category || '').localeCompare(b.category || '');
                    break;
                case 'visibility':
                    comparison = (a.visibility || '').localeCompare(b.visibility || '');
                    break;
            }
            
            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [artworks, searchQuery, statusFilter, processFilter, sortField, sortDirection]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            await deleteArtwork(id);
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' 
            ? <ChevronUp className="w-4 h-4" /> 
            : <ChevronDown className="w-4 h-4" />;
    };

    if (loading) {
        return <AdminDashboardSkeleton />;
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">Dashboard</h1>
                    <p className="text-[var(--text-secondary)]">Overview of your portfolio content</p>
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/artworks"
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Artwork
                    </Link>
                    <Link
                        href="/admin/posts"
                        className="px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-primary)]/10 text-[var(--text-primary)] rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Post
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Total Artworks */}
                <div className="card p-5 bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-[var(--accent-primary)]/10 rounded-lg">
                            <ImageIcon className="w-5 h-5 text-[var(--accent-primary)]" />
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">Artworks</span>
                    </div>
                    <div className="text-3xl font-bold text-[var(--text-primary)]">{stats.totalArtworks}</div>
                    <div className="mt-2 flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-green-500">
                            <Eye className="w-3 h-3" />
                            {stats.publishedArtworks} live
                        </span>
                        <span className="flex items-center gap-1 text-[var(--text-tertiary)]">
                            <EyeOff className="w-3 h-3" />
                            {stats.draftArtworks} draft
                        </span>
                    </div>
                </div>

                {/* With Process */}
                <div className="card p-5 bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Play className="w-5 h-5 text-purple-500" />
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">With Process</span>
                    </div>
                    <div className="text-3xl font-bold text-[var(--text-primary)]">{stats.withProcess}</div>
                    <div className="mt-2 text-xs text-[var(--text-tertiary)]">
                        {stats.totalArtworks > 0 
                            ? `${Math.round((stats.withProcess / stats.totalArtworks) * 100)}% of artworks`
                            : 'No artworks yet'
                        }
                    </div>
                </div>

                {/* Blog Posts */}
                <div className="card p-5 bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">Blog Posts</span>
                    </div>
                    <div className="text-3xl font-bold text-[var(--text-primary)]">{stats.totalPosts}</div>
                    <div className="mt-2 flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-green-500">
                            <CheckCircle className="w-3 h-3" />
                            {stats.publishedPosts} published
                        </span>
                        <span className="flex items-center gap-1 text-[var(--text-tertiary)]">
                            <Clock className="w-3 h-3" />
                            {stats.draftPosts} draft
                        </span>
                    </div>
                </div>

                {/* Comments */}
                <div className="card p-5 bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                            <MessageCircle className="w-5 h-5 text-orange-500" />
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">Comments</span>
                    </div>
                    <div className="text-3xl font-bold text-[var(--text-primary)]">{stats.totalComments}</div>
                    <div className="mt-2 flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-[var(--accent-primary)]">
                            <ImageIcon className="w-3 h-3" />
                            {stats.artworkComments} on art
                        </span>
                        <span className="flex items-center gap-1 text-blue-500">
                            <FileText className="w-3 h-3" />
                            {stats.postComments} on posts
                        </span>
                    </div>
                </div>

                {/* Engagement */}
                <div className="card p-5 bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-pink-500/10 rounded-lg">
                            <Heart className="w-5 h-5 text-pink-500" />
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">Engagement</span>
                    </div>
                    <div className="text-3xl font-bold text-pink-500">{stats.totalLikes}</div>
                    <div className="mt-2 text-xs text-[var(--text-tertiary)]">
                        Total likes on comments
                    </div>
                </div>
            </div>

            {/* Artworks Table */}
            <div className="card bg-[var(--bg-secondary)] border border-[var(--border-primary)] overflow-hidden">
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-[var(--border-primary)]">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 className="text-lg font-semibold text-[var(--text-primary)]">All Artworks</h2>
                        
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg text-sm focus:border-[var(--accent-primary)] outline-none w-48"
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                                className="px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg text-sm focus:border-[var(--accent-primary)] outline-none"
                            >
                                <option value="all">All Status</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>

                            {/* Process Filter */}
                            <select
                                value={processFilter}
                                onChange={(e) => setProcessFilter(e.target.value as typeof processFilter)}
                                className="px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg text-sm focus:border-[var(--accent-primary)] outline-none"
                            >
                                <option value="all">All Process</option>
                                <option value="with">With Process</option>
                                <option value="without">No Process</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--bg-tertiary)] text-left">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                                    Artwork
                                </th>
                                <th 
                                    className="px-6 py-3 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider cursor-pointer hover:text-[var(--accent-primary)]"
                                    onClick={() => handleSort('visibility')}
                                >
                                    <div className="flex items-center gap-1">
                                        Status <SortIcon field="visibility" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                                    Tags
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                                    Process
                                </th>
                                <th 
                                    className="px-6 py-3 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider cursor-pointer hover:text-[var(--accent-primary)]"
                                    onClick={() => handleSort('createdAt')}
                                >
                                    <div className="flex items-center gap-1">
                                        Date <SortIcon field="createdAt" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-primary)]">
                            {filteredArtworks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-tertiary)]">
                                        {searchQuery || statusFilter !== 'all' || processFilter !== 'all' 
                                            ? 'No artworks match your filters'
                                            : 'No artworks yet. Add your first artwork!'
                                        }
                                    </td>
                                </tr>
                            ) : (
                                filteredArtworks.map((artwork) => (
                                    <tr key={artwork.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                                        {/* Artwork Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--bg-tertiary)] flex-shrink-0">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={getImageUrl(artwork.cdnUrl, artwork.imageUrl, artwork.id)}
                                                        alt={artwork.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-[var(--text-primary)]">{artwork.title}</div>
                                                    <div className="text-xs text-[var(--text-tertiary)]">{artwork.category}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                artwork.visibility === 'published' 
                                                    ? 'bg-green-500/10 text-green-500' 
                                                    : 'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                                {artwork.visibility === 'published' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                {artwork.visibility === 'published' ? 'Published' : 'Draft'}
                                            </span>
                                        </td>

                                        {/* Tags */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                {artwork.tags?.slice(0, 2).map((tag) => (
                                                    <span key={tag} className="px-2 py-0.5 bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] text-xs rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {(artwork.tags?.length || 0) > 2 && (
                                                    <span className="text-xs text-[var(--text-tertiary)]">
                                                        +{artwork.tags!.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Process */}
                                        <td className="px-6 py-4">
                                            {artwork.hasProcess ? (
                                                <span className="inline-flex items-center gap-1 text-purple-500 text-sm">
                                                    <Play className="w-4 h-4" />
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="text-[var(--text-tertiary)] text-sm">—</span>
                                            )}
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                            {artwork.createdAt instanceof Date 
                                                ? artwork.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                : '—'
                                            }
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/artworks?edit=${artwork.id}`}
                                                    className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(artwork.id, artwork.title)}
                                                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-[var(--text-secondary)] hover:text-red-500"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="px-6 py-4 border-t border-[var(--border-primary)] text-sm text-[var(--text-tertiary)]">
                    Showing {filteredArtworks.length} of {artworks.length} artworks
                </div>
            </div>

            {/* Recent Posts Section */}
            <div className="card bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Posts</h2>
                    <Link 
                        href="/admin/posts"
                        className="text-sm text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors"
                    >
                        View All
                    </Link>
                </div>
                
                {posts.length === 0 ? (
                    <p className="text-[var(--text-tertiary)] text-center py-8">No blog posts yet</p>
                ) : (
                    <div className="space-y-3">
                        {posts.slice(0, 5).map((post) => (
                            <div key={post.id} className="flex items-center justify-between py-2 border-b border-[var(--border-primary)] last:border-0">
                                <div>
                                    <div className="font-medium text-[var(--text-primary)]">{post.title}</div>
                                    <div className="text-xs text-[var(--text-tertiary)]">{post.publishDate}</div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    post.status === 'published' 
                                        ? 'bg-green-500/10 text-green-500' 
                                        : 'bg-yellow-500/10 text-yellow-500'
                                }`}>
                                    {post.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Comments Section */}
            <div className="card bg-[var(--bg-secondary)] border border-[var(--border-primary)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border-primary)]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-orange-500" />
                            Recent Comments
                        </h2>
                        {allCommentsLoading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[var(--accent-primary)]"></div>
                        )}
                    </div>
                </div>
                
                {allComments.length === 0 ? (
                    <div className="px-6 py-12 text-center text-[var(--text-tertiary)]">
                        No comments yet
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--border-primary)]">
                        {allComments.slice(0, 10).map((comment) => {
                            // Find the target name (artwork or post)
                            const targetItem = comment.targetType === 'artwork' 
                                ? artworks.find(a => a.id === comment.targetId)
                                : posts.find(p => p.id === comment.targetId);
                            const targetName = targetItem 
                                ? ('title' in targetItem ? targetItem.title : 'Unknown')
                                : 'Deleted Item';

                            return (
                                <div key={comment.id} className="px-6 py-4 hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            {/* Author and time */}
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-[var(--text-primary)]">
                                                    {comment.authorName || 'Anonymous'}
                                                </span>
                                                <span className="text-xs text-[var(--text-tertiary)]">
                                                    {comment.createdAt instanceof Date 
                                                        ? comment.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                                                        : ''
                                                    }
                                                </span>
                                                {comment.parentId && (
                                                    <span className="text-xs bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-[var(--text-tertiary)]">
                                                        reply
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Comment content */}
                                            <p className="text-sm text-[var(--text-secondary)] mb-2 line-clamp-2">
                                                {comment.content}
                                            </p>
                                            
                                            {/* Target and engagement */}
                                            <div className="flex items-center gap-3 text-xs">
                                                <span className={`flex items-center gap-1 ${
                                                    comment.targetType === 'artwork' 
                                                        ? 'text-[var(--accent-primary)]' 
                                                        : 'text-blue-500'
                                                }`}>
                                                    {comment.targetType === 'artwork' 
                                                        ? <ImageIcon className="w-3 h-3" /> 
                                                        : <FileText className="w-3 h-3" />
                                                    }
                                                    <span className="truncate max-w-[150px]">{targetName}</span>
                                                </span>
                                                {comment.likes > 0 && (
                                                    <span className="flex items-center gap-1 text-pink-500">
                                                        <Heart className="w-3 h-3 fill-current" />
                                                        {comment.likes}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Delete button */}
                                        <button
                                            onClick={() => handleDeleteComment(comment.id, comment.targetId)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-[var(--text-tertiary)] hover:text-red-500 flex-shrink-0"
                                            title="Delete comment"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                
                {allComments.length > 10 && (
                    <div className="px-6 py-4 border-t border-[var(--border-primary)] text-sm text-[var(--text-tertiary)]">
                        Showing 10 of {allComments.length} comments
                    </div>
                )}
            </div>
        </div>
    );
}
