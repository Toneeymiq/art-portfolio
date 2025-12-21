'use client';

import { createContext, useContext, useState, useCallback, useRef, ReactNode, useEffect } from 'react';
import { Comment, CommentInput } from '@/types/comment';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, increment, Timestamp } from 'firebase/firestore';

// List of animals for anonymous names (client-side fallback)
const ANIMALS = [
    'Penguin', 'Fox', 'Owl', 'Panda', 'Koala', 'Wolf', 'Bear', 'Tiger',
    'Lion', 'Eagle', 'Dolphin', 'Rabbit', 'Deer', 'Hawk', 'Falcon',
    'Otter', 'Seal', 'Whale', 'Shark', 'Octopus', 'Turtle', 'Parrot',
    'Peacock', 'Swan', 'Crane', 'Phoenix', 'Dragon', 'Unicorn', 'Griffin',
    'Lynx', 'Jaguar', 'Cheetah', 'Panther', 'Leopard', 'Gazelle', 'Antelope'
];

function getRandomAnimal(): string {
    return ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
}

// Generate or retrieve session ID for tracking likes
function getSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = localStorage.getItem('portfolio_session_id');
    if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('portfolio_session_id', sessionId);
    }
    return sessionId;
}

interface CommentsContextType {
    // Cache management
    getComments: (targetId: string) => Comment[];
    isLoading: () => boolean;
    fetchComments: () => Promise<void>;
    
    // Comment operations
    addComment: (targetId: string, targetType: 'artwork' | 'post', input: Omit<CommentInput, 'targetId' | 'targetType'>) => Promise<Comment>;
    toggleLike: (targetId: string, commentId: string) => Promise<{ liked: boolean; likes: number }>;
    deleteComment: (targetId: string, commentId: string) => Promise<void>;
    
    // Helpers
    hasLiked: (comment: Comment) => boolean;
    getTopLevelComments: (targetId: string) => Comment[];
    getReplies: (targetId: string, parentId: string) => Comment[];
    sessionId: string;
    
    // All comments for admin
    allComments: Comment[];
    fetchAllComments: () => Promise<void>;
    allCommentsLoading: boolean;
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

export function CommentsProvider({ children }: { children: ReactNode }) {
    const [allComments, setAllComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [sessionId, setSessionId] = useState('');
    const unsubscribeRef = useRef<(() => void) | null>(null);
    
    // Initialize session ID on client
    useEffect(() => {
        setSessionId(getSessionId());
    }, []);

    // Set up realtime listener for all comments
    useEffect(() => {
        const commentsRef = collection(db, 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const comments: Comment[] = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    targetId: data.targetId,
                    targetType: data.targetType,
                    parentId: data.parentId || undefined,
                    authorName: data.authorName || `Anonymous ${getRandomAnimal()}`,
                    content: data.content,
                    likes: data.likes || 0,
                    likedBy: data.likedBy || [],
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || undefined,
                };
            });
            setAllComments(comments);
            setLoading(false);
        }, (error) => {
            console.error('Error listening to comments:', error);
            setLoading(false);
        });

        unsubscribeRef.current = unsubscribe;
        
        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, []);

    const getComments = useCallback((targetId: string): Comment[] => {
        return allComments.filter(c => c.targetId === targetId);
    }, [allComments]);

    const isLoading = useCallback((): boolean => {
        return loading;
    }, [loading]);

    const fetchComments = useCallback(async () => {
        // With realtime updates, this is essentially a no-op
        // Comments are automatically synced
    }, []);

    const addComment = useCallback(async (
        targetId: string, 
        targetType: 'artwork' | 'post', 
        input: Omit<CommentInput, 'targetId' | 'targetType'>
    ): Promise<Comment> => {
        // Generate anonymous animal name if no name provided
        const authorName = input.authorName?.trim() || `Anonymous ${getRandomAnimal()}`;

        const newComment = {
            targetId,
            targetType,
            parentId: input.parentId || null,
            authorName,
            content: input.content.trim(),
            likes: 0,
            likedBy: [],
            createdAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, 'comments'), newComment);

        const comment: Comment = {
            id: docRef.id,
            ...newComment,
            parentId: newComment.parentId || undefined,
            createdAt: new Date(),
        };

        // The realtime listener will automatically update allComments
        return comment;
    }, []);

    const toggleLike = useCallback(async (targetId: string, commentId: string) => {
        const commentRef = doc(db, 'comments', commentId);
        const comment = allComments.find(c => c.id === commentId);
        
        if (!comment) throw new Error('Comment not found');
        
        const hasLikedComment = comment.likedBy.includes(sessionId);
        
        if (hasLikedComment) {
            // Unlike
            await updateDoc(commentRef, {
                likes: increment(-1),
                likedBy: arrayRemove(sessionId),
            });
        } else {
            // Like
            await updateDoc(commentRef, {
                likes: increment(1),
                likedBy: arrayUnion(sessionId),
            });
        }

        // The realtime listener will automatically update allComments
        return { liked: !hasLikedComment, likes: hasLikedComment ? comment.likes - 1 : comment.likes + 1 };
    }, [sessionId, allComments]);

    const deleteComment = useCallback(async (targetId: string, commentId: string) => {
        await deleteDoc(doc(db, 'comments', commentId));
        
        // Also delete replies to this comment
        const replies = allComments.filter(c => c.parentId === commentId);
        for (const reply of replies) {
            await deleteDoc(doc(db, 'comments', reply.id));
        }
        
        // The realtime listener will automatically update allComments
    }, [allComments]);

    const hasLiked = useCallback((comment: Comment): boolean => {
        return comment.likedBy.includes(sessionId);
    }, [sessionId]);

    const getTopLevelComments = useCallback((targetId: string): Comment[] => {
        return allComments.filter(c => c.targetId === targetId && !c.parentId);
    }, [allComments]);

    const getReplies = useCallback((targetId: string, parentId: string): Comment[] => {
        return allComments.filter(c => c.targetId === targetId && c.parentId === parentId);
    }, [allComments]);

    // Fetch all comments for admin dashboard (no longer needed with realtime, but kept for compatibility)
    const fetchAllComments = useCallback(async () => {
        // With realtime updates, comments are already in allComments
        // This is a no-op now
    }, []);

    return (
        <CommentsContext.Provider value={{
            getComments,
            isLoading,
            fetchComments,
            addComment,
            toggleLike,
            deleteComment,
            hasLiked,
            getTopLevelComments,
            getReplies,
            sessionId,
            allComments,
            fetchAllComments,
            allCommentsLoading: loading,
        }}>
            {children}
        </CommentsContext.Provider>
    );
}

export function useCommentsContext() {
    const context = useContext(CommentsContext);
    if (context === undefined) {
        throw new Error('useCommentsContext must be used within a CommentsProvider');
    }
    return context;
}
