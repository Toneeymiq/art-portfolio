import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Artwork } from '../types/artwork';

export async function getArtworks(): Promise<Artwork[]> {
  const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  })) as Artwork[];
}