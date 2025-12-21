import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    DocumentData,
    QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import { Artwork, ContentStatus } from '@/types/artwork';
import { Post } from '@/types/post';
import { ProcessEntry } from '@/types/process';
import { CommissionInfo } from '@/types/commission';
import { StaffMember } from '@/types/staff';
import { ContactMessage } from '@/types/contact';
import { SiteSettings, defaultSiteSettings } from '@/types/settings';

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Converts Firestore Timestamp to JS Date
 */
function convertTimestamps<T>(data: T): T {
    const converted = { ...data } as Record<string, unknown>;
    for (const key in converted) {
        const value = converted[key];
        if (value instanceof Timestamp) {
            converted[key] = value.toDate();
        }
    }
    return converted as T;
}

/**
 * Prepares data for Firestore (converts Dates to Timestamps)
 */
function prepareForFirestore<T>(data: T): Record<string, unknown> {
    const prepared = { ...data } as Record<string, unknown>;
    for (const key in prepared) {
        const value = prepared[key];
        if (value instanceof Date) {
            prepared[key] = Timestamp.fromDate(value);
        }
    }
    return prepared;
}

// ============================================
// ARTWORKS COLLECTION
// ============================================

const ARTWORKS_COLLECTION = 'artworks';

export async function getArtworks(options?: {
    category?: Artwork['category'];
    visibility?: ContentStatus;
    limitCount?: number;
}): Promise<Artwork[]> {
    const constraints: QueryConstraint[] = [];

    if (options?.visibility) {
        constraints.push(where('visibility', '==', options.visibility));
    }
    if (options?.category) {
        constraints.push(where('category', '==', options.category));
    }
    const q = query(collection(db, ARTWORKS_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);

    const artworks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...convertTimestamps(doc.data()),
    })) as Artwork[];

    // Sort in memory to avoid requiring composite indexes
    return artworks.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
    });
}

export async function getArtworkById(id: string): Promise<Artwork | null> {
    const docRef = doc(db, ARTWORKS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data()),
    } as Artwork;
}

export async function createArtwork(
    artwork: Omit<Artwork, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
    const now = new Date();
    const docRef = await addDoc(collection(db, ARTWORKS_COLLECTION), {
        ...prepareForFirestore(artwork as DocumentData),
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
    });
    return docRef.id;
}

export async function updateArtwork(
    id: string,
    artwork: Partial<Omit<Artwork, 'id' | 'createdAt'>>
): Promise<void> {
    const docRef = doc(db, ARTWORKS_COLLECTION, id);
    await updateDoc(docRef, {
        ...prepareForFirestore(artwork as DocumentData),
        updatedAt: Timestamp.fromDate(new Date()),
    });
}

export async function deleteArtwork(id: string): Promise<void> {
    const docRef = doc(db, ARTWORKS_COLLECTION, id);
    await deleteDoc(docRef);
}

// ============================================
// POSTS COLLECTION
// ============================================

const POSTS_COLLECTION = 'posts';

export async function getPosts(options?: {
    status?: ContentStatus;
    limitCount?: number;
}): Promise<Post[]> {
    const constraints: QueryConstraint[] = [];

    if (options?.status) {
        constraints.push(where('status', '==', options.status));
    }
    const q = query(collection(db, POSTS_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);

    const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...convertTimestamps(doc.data()),
    })) as Post[];

    // Sort in memory to avoid requiring composite indexes
    return posts.sort((a, b) => {
        const dateA = new Date(a.publishDate).getTime();
        const dateB = new Date(b.publishDate).getTime();
        return dateB - dateA;
    });
}

export async function getPostById(id: string): Promise<Post | null> {
    const docRef = doc(db, POSTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data()),
    } as Post;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const q = query(collection(db, POSTS_COLLECTION), where('slug', '==', slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
        id: doc.id,
        ...convertTimestamps(doc.data()),
    } as Post;
}

export async function createPost(
    post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
    const now = new Date();
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
        ...prepareForFirestore(post as DocumentData),
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
    });
    return docRef.id;
}

export async function updatePost(
    id: string,
    post: Partial<Omit<Post, 'id' | 'createdAt'>>
): Promise<void> {
    const docRef = doc(db, POSTS_COLLECTION, id);
    await updateDoc(docRef, {
        ...prepareForFirestore(post as DocumentData),
        updatedAt: Timestamp.fromDate(new Date()),
    });
}

export async function deletePost(id: string): Promise<void> {
    const docRef = doc(db, POSTS_COLLECTION, id);
    await deleteDoc(docRef);
}

// ============================================
// PROCESS ENTRIES COLLECTION
// ============================================

const PROCESS_COLLECTION = 'process';

export async function getProcessEntries(options?: {
    visibility?: ContentStatus;
    limitCount?: number;
}): Promise<ProcessEntry[]> {
    const constraints: QueryConstraint[] = [];

    if (options?.visibility) {
        constraints.push(where('visibility', '==', options.visibility));
    }
    const q = query(collection(db, PROCESS_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);

    const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...convertTimestamps(doc.data()),
    })) as ProcessEntry[];

    // Sort in memory to avoid requiring composite indexes
    return entries.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
    });
}

export async function getProcessEntryById(id: string): Promise<ProcessEntry | null> {
    const docRef = doc(db, PROCESS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data()),
    } as ProcessEntry;
}

export async function getProcessEntryByArtworkId(
    artworkId: string
): Promise<ProcessEntry | null> {
    const q = query(
        collection(db, PROCESS_COLLECTION),
        where('artworkId', '==', artworkId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
        id: doc.id,
        ...convertTimestamps(doc.data()),
    } as ProcessEntry;
}

export async function createProcessEntry(
    entry: Omit<ProcessEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
    const now = new Date();
    const docRef = await addDoc(collection(db, PROCESS_COLLECTION), {
        ...prepareForFirestore(entry as DocumentData),
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
    });
    return docRef.id;
}

export async function updateProcessEntry(
    id: string,
    entry: Partial<Omit<ProcessEntry, 'id' | 'createdAt'>>
): Promise<void> {
    const docRef = doc(db, PROCESS_COLLECTION, id);
    await updateDoc(docRef, {
        ...prepareForFirestore(entry as DocumentData),
        updatedAt: Timestamp.fromDate(new Date()),
    });
}

export async function deleteProcessEntry(id: string): Promise<void> {
    const docRef = doc(db, PROCESS_COLLECTION, id);
    await deleteDoc(docRef);
}

// ============================================
// COMMISSION INFO (Singleton Document)
// ============================================

const SETTINGS_COLLECTION = 'settings';
const COMMISSION_DOC_ID = 'commission_info';

export async function getCommissionInfo(): Promise<CommissionInfo | null> {
    const docRef = doc(db, SETTINGS_COLLECTION, COMMISSION_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data()),
    } as CommissionInfo;
}

export async function updateCommissionInfo(
    info: Omit<CommissionInfo, 'id' | 'updatedAt'>
): Promise<void> {
    const docRef = doc(db, SETTINGS_COLLECTION, COMMISSION_DOC_ID);
    const docSnap = await getDoc(docRef);

    const data = {
        ...prepareForFirestore(info as DocumentData),
        updatedAt: Timestamp.fromDate(new Date()),
    };

    if (docSnap.exists()) {
        await updateDoc(docRef, data);
    } else {
        // Create with setDoc if it doesn't exist
        const { setDoc } = await import('firebase/firestore');
        await setDoc(docRef, data);
    }
}

// ============================================
// UTILITY: Seed Initial Data (for development)
// ============================================

export async function seedInitialData() {
    console.log('Seeding initial data...');

    // Check if artworks already exist
    const existingArtworks = await getArtworks({ limitCount: 1 });
    if (existingArtworks.length > 0) {
        console.log('Data already exists, skipping seed.');
        return;
    }

    // Note: No sample artworks are created by default.
    // Artists should add their own artwork through the CMS.
    // If you want sample data, add your own images from:
    // - Unsplash: https://images.unsplash.com/photo-{ID}
    // - Google Drive: https://lh3.googleusercontent.com/d/{FILE_ID}
    // - Imgur: https://i.imgur.com/{ID}.jpg
    // - Your own CDN

    // Seed sample commission info (doesn't require images)
    await updateCommissionInfo({
        servicesOffered: [
            'Character Illustrations',
            'Portrait Art',
            'Concept Art',
            'Book Covers',
            'Game Assets',
        ],
        workflowDescription:
            'I start with a detailed consultation to understand your vision, then move through concept sketches, refinement, coloring, and final polish.',
        pricingNotes:
            'Prices vary based on complexity and usage rights. Contact me for a custom quote.',
        turnaroundTime: '1-3 weeks depending on complexity',
        paymentMethods: 'PayPal, Bank Transfer',
        status: 'active',
    });

    // Seed artist profile (without image - can be added via CMS)
    const sampleStaff: Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
            name: 'Miqk Niq',
            role: 'Lead Artist',
            imageUrl: '', // Add your profile image URL via CMS
            bio: 'Digital artist specializing in character design and concept art.',
            order: 1,
            isActive: true,
        },
    ];

    for (const staff of sampleStaff) {
        await createStaffMember(staff);
    }

    console.log('Seed data complete! Add your artwork through the CMS at /admin/artworks');
}

// ============================================
// STAFF MEMBERS COLLECTION
// ============================================

const STAFF_COLLECTION = 'staff';

export async function getStaffMembers(options?: {
    activeOnly?: boolean;
}): Promise<StaffMember[]> {
    const constraints: QueryConstraint[] = [];

    if (options?.activeOnly) {
        constraints.push(where('isActive', '==', true));
    }
    const q = query(collection(db, STAFF_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);

    const staff = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...convertTimestamps(doc.data()),
    })) as StaffMember[];

    // Sort in memory to avoid requiring composite indexes
    return staff.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function getStaffMemberById(id: string): Promise<StaffMember | null> {
    const docRef = doc(db, STAFF_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data()),
    } as StaffMember;
}

export async function createStaffMember(
    member: Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
    const now = new Date();
    const docRef = await addDoc(collection(db, STAFF_COLLECTION), {
        ...prepareForFirestore(member),
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
    });
    return docRef.id;
}

export async function updateStaffMember(
    id: string,
    member: Partial<Omit<StaffMember, 'id' | 'createdAt'>>
): Promise<void> {
    const docRef = doc(db, STAFF_COLLECTION, id);
    await updateDoc(docRef, {
        ...prepareForFirestore(member),
        updatedAt: Timestamp.fromDate(new Date()),
    });
}

export async function deleteStaffMember(id: string): Promise<void> {
    const docRef = doc(db, STAFF_COLLECTION, id);
    await deleteDoc(docRef);
}

// ============================================
// CONTACT MESSAGES COLLECTION
// ============================================

const CONTACTS_COLLECTION = 'contact_messages';

export async function getContactMessages(options?: {
    status?: ContactMessage['status'];
    limitCount?: number;
}): Promise<ContactMessage[]> {
    const constraints: QueryConstraint[] = [];

    if (options?.status) {
        constraints.push(where('status', '==', options.status));
    }
    const q = query(collection(db, CONTACTS_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);

    const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...convertTimestamps(doc.data()),
    })) as ContactMessage[];

    // Sort in memory to avoid requiring composite indexes
    return messages.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
    });
}

export async function getContactMessageById(id: string): Promise<ContactMessage | null> {
    const docRef = doc(db, CONTACTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data()),
    } as ContactMessage;
}

export async function createContactMessage(
    message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>
): Promise<string> {
    const now = new Date();
    const docRef = await addDoc(collection(db, CONTACTS_COLLECTION), {
        ...prepareForFirestore(message),
        status: 'new',
        createdAt: Timestamp.fromDate(now),
    });
    return docRef.id;
}

export async function updateContactMessageStatus(
    id: string,
    status: ContactMessage['status']
): Promise<void> {
    const docRef = doc(db, CONTACTS_COLLECTION, id);
    await updateDoc(docRef, { status });
}

export async function deleteContactMessage(id: string): Promise<void> {
    const docRef = doc(db, CONTACTS_COLLECTION, id);
    await deleteDoc(docRef);
}

// ============================================
// SITE SETTINGS (Singleton Document)
// ============================================

const SITE_SETTINGS_DOC_ID = 'site_settings';

export async function getSiteSettings(): Promise<SiteSettings | null> {
    const docRef = doc(db, SETTINGS_COLLECTION, SITE_SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data()),
    } as SiteSettings;
}

export async function updateSiteSettings(
    settings: Partial<Omit<SiteSettings, 'id' | 'updatedAt'>>
): Promise<void> {
    const docRef = doc(db, SETTINGS_COLLECTION, SITE_SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    const data = {
        ...prepareForFirestore(settings),
        updatedAt: Timestamp.fromDate(new Date()),
    };

    if (docSnap.exists()) {
        await updateDoc(docRef, data);
    } else {
        const { setDoc } = await import('firebase/firestore');
        await setDoc(docRef, { ...defaultSiteSettings, ...data });
    }
}

export async function initializeSiteSettings(): Promise<void> {
    const existing = await getSiteSettings();
    if (!existing) {
        await updateSiteSettings(defaultSiteSettings);
        console.log('Site settings initialized with defaults');
    }
}
