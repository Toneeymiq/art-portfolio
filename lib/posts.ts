import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Post } from '../types/post';

export async function getPosts(): Promise<Post[]> {
    const q = query(collection(db, 'posts'), orderBy('publishDate', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Handle potential missing timestamps if seeded manually or old data
        createdAt: doc.data().createdAt?.toDate?.(),
        updatedAt: doc.data().updatedAt?.toDate?.(),
    })) as Post[];
}
