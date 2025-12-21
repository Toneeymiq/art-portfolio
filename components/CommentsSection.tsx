'use client';

import { useState } from 'react';
import { MessageCircle, Heart, Reply, Send, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useComments } from '@/hooks/useComments';
import { Comment } from '@/types/comment';

interface CommentsSectionProps {
    targetId: string;
    targetType: 'artwork' | 'post';
    className?: string;
}

function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface CommentFormProps {
    onSubmit: (content: string, authorName?: string) => Promise<void>;
    submitting: boolean;
    placeholder?: string;
    compact?: boolean;
}

function CommentForm({ onSubmit, submitting, placeholder = 'Write a comment...', compact = false }: CommentFormProps) {
    const [content, setContent] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [showNameInput, setShowNameInput] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || submitting) return;
        
        await onSubmit(content.trim(), authorName.trim() || undefined);
        setContent('');
        setAuthorName('');
        setShowNameInput(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex gap-2">
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={placeholder}
                        rows={compact ? 1 : 2}
                        className="w-full p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] focus:border-[var(--accent-primary)] outline-none resize-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!content.trim() || submitting}
                    className="px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
            
            {/* Optional name input */}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setShowNameInput(!showNameInput)}
                    className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] flex items-center gap-1"
                >
                    <User className="w-3 h-3" />
                    {showNameInput ? 'Hide name' : 'Add your name (optional)'}
                </button>
            </div>
            
            {showNameInput && (
                <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Your name (leave empty for Anonymous)"
                    maxLength={50}
                    className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] focus:border-[var(--accent-primary)] outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                />
            )}
        </form>
    );
}

interface SingleCommentProps {
    comment: Comment;
    replies: Comment[];
    onLike: (commentId: string) => Promise<void>;
    onReply: (parentId: string, content: string, authorName?: string) => Promise<void>;
    hasLiked: boolean;
    submitting: boolean;
    depth?: number;
}

function SingleComment({ comment, replies, onLike, onReply, hasLiked, submitting, depth = 0 }: SingleCommentProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showReplies, setShowReplies] = useState(true);
    const [liking, setLiking] = useState(false);

    const handleLike = async () => {
        if (liking) return;
        setLiking(true);
        try {
            await onLike(comment.id);
        } finally {
            setLiking(false);
        }
    };

    const handleReply = async (content: string, authorName?: string) => {
        await onReply(comment.id, content, authorName);
        setShowReplyForm(false);
    };

    const maxDepth = 2; // Limit nesting depth

    return (
        <div className={`${depth > 0 ? 'ml-6 pl-4 border-l-2 border-[var(--border-primary)]' : ''}`}>
            <div className="py-3">
                {/* Comment Header */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-[var(--accent-primary)]" />
                    </div>
                    <span className="font-medium text-sm text-[var(--text-primary)]">
                        {comment.authorName}
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)]">
                        {formatTimeAgo(comment.createdAt)}
                    </span>
                </div>

                {/* Comment Content */}
                <p className="text-sm text-[var(--text-secondary)] mb-3 whitespace-pre-wrap">
                    {comment.content}
                </p>

                {/* Comment Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLike}
                        disabled={liking}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${
                            hasLiked 
                                ? 'text-red-500' 
                                : 'text-[var(--text-tertiary)] hover:text-red-500'
                        }`}
                    >
                        <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                        <span>{comment.likes || 0}</span>
                    </button>

                    {depth < maxDepth && (
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors"
                        >
                            <Reply className="w-4 h-4" />
                            Reply
                        </button>
                    )}
                </div>

                {/* Reply Form */}
                {showReplyForm && (
                    <div className="mt-3">
                        <CommentForm
                            onSubmit={handleReply}
                            submitting={submitting}
                            placeholder={`Reply to ${comment.authorName}...`}
                            compact
                        />
                    </div>
                )}
            </div>

            {/* Replies */}
            {replies.length > 0 && (
                <div className="mt-2">
                    <button
                        onClick={() => setShowReplies(!showReplies)}
                        className="flex items-center gap-1 text-xs text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] mb-2"
                    >
                        {showReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                    </button>
                    
                    {showReplies && (
                        <div className="space-y-1">
                            {replies.map(reply => (
                                <SingleComment
                                    key={reply.id}
                                    comment={reply}
                                    replies={[]} // No nested replies beyond depth
                                    onLike={onLike}
                                    onReply={onReply}
                                    hasLiked={false}
                                    submitting={submitting}
                                    depth={depth + 1}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function CommentsSection({ targetId, targetType, className = '' }: CommentsSectionProps) {
    const {
        topLevelComments,
        getReplies,
        loading,
        submitting,
        addComment,
        toggleLike,
        hasLiked,
    } = useComments({ targetId, targetType });

    const [expanded, setExpanded] = useState(false);

    const handleAddComment = async (content: string, authorName?: string) => {
        await addComment({ content, authorName });
    };

    const handleReply = async (parentId: string, content: string, authorName?: string) => {
        await addComment({ content, authorName, parentId });
    };

    const handleLike = async (commentId: string) => {
        await toggleLike(commentId);
    };

    const totalComments = topLevelComments.reduce((acc, c) => acc + 1 + getReplies(c.id).length, 0);

    return (
        <div className={`${className}`}>
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between py-3 text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors"
            >
                <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">Comments</span>
                    <span className="text-sm text-[var(--text-tertiary)]">({totalComments})</span>
                </div>
                {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {/* Content */}
            {expanded && (
                <div className="pt-2 animate-fade-in-up">
                    {/* Add Comment Form */}
                    <div className="mb-6">
                        <CommentForm
                            onSubmit={handleAddComment}
                            submitting={submitting}
                        />
                    </div>

                    {/* Comments List */}
                    {loading ? (
                        <div className="text-center py-8 text-[var(--text-tertiary)]">
                            <div className="animate-spin w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full mx-auto mb-2" />
                            Loading comments...
                        </div>
                    ) : topLevelComments.length === 0 ? (
                        <div className="text-center py-8 text-[var(--text-tertiary)]">
                            <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                            <p>No comments yet. Be the first to comment!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--border-primary)]">
                            {topLevelComments.map(comment => (
                                <SingleComment
                                    key={comment.id}
                                    comment={comment}
                                    replies={getReplies(comment.id)}
                                    onLike={handleLike}
                                    onReply={handleReply}
                                    hasLiked={hasLiked(comment)}
                                    submitting={submitting}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
