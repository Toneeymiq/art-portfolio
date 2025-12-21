import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, doc, updateDoc, deleteDoc, increment, arrayUnion, arrayRemove, Timestamp } from 'firebase/firestore';
import { Comment, CommentInput } from '@/types/comment';

// List of animals for anonymous names
const ANIMALS = [
    'Penguin', 'Fox', 'Owl', 'Panda', 'Koala', 'Wolf', 'Bear', 'Tiger',
    'Lion', 'Eagle', 'Dolphin', 'Rabbit', 'Deer', 'Hawk', 'Falcon',
    'Otter', 'Seal', 'Whale', 'Shark', 'Octopus', 'Turtle', 'Parrot',
    'Peacock', 'Swan', 'Crane', 'Phoenix', 'Dragon', 'Unicorn', 'Griffin',
    'Lynx', 'Jaguar', 'Cheetah', 'Panther', 'Leopard', 'Gazelle', 'Antelope',
    'Hedgehog', 'Squirrel', 'Raccoon', 'Badger', 'Beaver', 'Hummingbird',
    'Butterfly', 'Firefly', 'Starfish', 'Seahorse', 'Jellyfish', 'Raven', 'Crow'
];

function getRandomAnimal(): string {
    return ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
}

// GET - Fetch comments for a target (artwork or post) or all comments
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const targetId = searchParams.get('targetId');
        const targetType = searchParams.get('targetType');
        const fetchAll = searchParams.get('all') === 'true';

        const commentsRef = collection(db, 'comments');
        
        // Use a simple orderBy query to avoid needing composite indexes
        // Filter by targetId/targetType in JavaScript
        const q = query(commentsRef, orderBy('createdAt', 'desc'));

        const snapshot = await getDocs(q);
        let comments: Comment[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                targetId: data.targetId,
                targetType: data.targetType,
                parentId: data.parentId || undefined,
                authorName: data.authorName || 'Anonymous',
                content: data.content,
                likes: data.likes || 0,
                likedBy: data.likedBy || [],
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || undefined,
            };
        });

        // Filter by targetId and targetType if not fetching all
        if (!fetchAll) {
            if (!targetId || !targetType) {
                return NextResponse.json({ error: 'targetId and targetType are required' }, { status: 400 });
            }
            comments = comments.filter(c => c.targetId === targetId && c.targetType === targetType);
        }

        return NextResponse.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

// POST - Create a new comment
export async function POST(request: NextRequest) {
    try {
        const body: CommentInput = await request.json();

        if (!body.targetId || !body.targetType || !body.content) {
            return NextResponse.json({ error: 'targetId, targetType, and content are required' }, { status: 400 });
        }

        // Generate anonymous animal name if no name provided
        const authorName = body.authorName?.trim() || `Anonymous ${getRandomAnimal()}`;

        const newComment = {
            targetId: body.targetId,
            targetType: body.targetType,
            parentId: body.parentId || null,
            authorName,
            content: body.content.trim(),
            likes: 0,
            likedBy: [],
            createdAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, 'comments'), newComment);

        return NextResponse.json({
            id: docRef.id,
            ...newComment,
            createdAt: new Date(),
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}

// DELETE - Delete a comment
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const commentId = searchParams.get('id');

        if (!commentId) {
            return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
        }

        await deleteDoc(doc(db, 'comments', commentId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
    }
}
