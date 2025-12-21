import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';

// POST - Toggle like on a comment
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { commentId, sessionId } = body;

        if (!commentId || !sessionId) {
            return NextResponse.json({ error: 'commentId and sessionId are required' }, { status: 400 });
        }

        const commentRef = doc(db, 'comments', commentId);
        const commentSnap = await getDoc(commentRef);

        if (!commentSnap.exists()) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }

        const commentData = commentSnap.data();
        const likedBy = commentData.likedBy || [];
        const hasLiked = likedBy.includes(sessionId);

        if (hasLiked) {
            // Unlike
            await updateDoc(commentRef, {
                likes: increment(-1),
                likedBy: arrayRemove(sessionId),
            });
            return NextResponse.json({ liked: false, likes: (commentData.likes || 1) - 1 });
        } else {
            // Like
            await updateDoc(commentRef, {
                likes: increment(1),
                likedBy: arrayUnion(sessionId),
            });
            return NextResponse.json({ liked: true, likes: (commentData.likes || 0) + 1 });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
    }
}
