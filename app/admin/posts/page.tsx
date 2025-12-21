'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs } from 'firebase/firestore';
import { Post, ContentStatus } from '@/types/post';
import { Artwork } from '@/types/artwork';
import { Plus, Pencil, Trash2, X, Save, FileText, Link as LinkIcon } from 'lucide-react';
import { AdminPostsSkeleton } from '@/components/SkeletonLoaders';

export default function AdminPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<Post>>({});

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'posts'), (snap) => {
            const data = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
            })) as Post[];

            data.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

            setPosts(data);
            setLoading(false);
        });

        // Fetch Artworks for Dropdown
        async function fetchArtworks() {
            const snap = await getDocs(collection(db, 'artworks'));
            const arts = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Artwork[];
            setArtworks(arts);
        }
        fetchArtworks();

        return () => unsub();
    }, []);

    const handleSave = async () => {
        if (!currentPost.title) return alert('Title is required');
        if (!currentPost.slug) return alert('Slug is required');

        try {
            const postData = {
                ...currentPost,
                updatedAt: serverTimestamp(),
                // Ensure date is set
                publishDate: currentPost.publishDate || new Date().toISOString().split('T')[0],
            };

            if (currentPost.id) {
                const ref = doc(db, 'posts', currentPost.id);
                const { id, ...dataToUpdate } = postData as any;
                await updateDoc(ref, dataToUpdate);
            } else {
                await addDoc(collection(db, 'posts'), {
                    ...postData,
                    status: currentPost.status || 'draft',
                    createdAt: serverTimestamp(),
                });
            }
            setIsEditing(false);
            setCurrentPost({});
        } catch (e) {
            console.error(e);
            alert('Error saving post');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            await deleteDoc(doc(db, 'posts', id));
        } catch (e) {
            console.error(e);
            alert('Error deleting post');
        }
    };

    const openEdit = (post: Post) => {
        setCurrentPost(post);
        setIsEditing(true);
    };

    const openNew = () => {
        setCurrentPost({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            readTime: '5 min read',
            status: 'draft',
            publishDate: new Date().toISOString().split('T')[0],
        });
        setIsEditing(true);
    };

    // Helper to auto-generate slug from title
    const handleTitleChange = (val: string) => {
        if (!isEditing) return; // safety
        const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setCurrentPost(prev => ({
            ...prev,
            title: val,
            slug: prev.slug ? prev.slug : slug // only auto-fill if empty or logic desires
        }));
    }

    if (loading) return <AdminPostsSkeleton />;

    return (
        <>
            <div className="space-y-6 animate-fade-in-up">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Blog Posts</h1>
                        <p className="text-[var(--text-secondary)]">Share your thoughts and updates.</p>
                    </div>
                    <button
                        onClick={openNew}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Post
                    </button>
                </div>

                <div className="space-y-4">
                    {posts.map(post => (
                        <div key={post.id} className="card p-4 flex items-center justify-between group bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg relative">
                                    <FileText className="w-6 h-6 text-[var(--accent-primary)]" />
                                    {post.status === 'draft' && <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>}
                                </div>
                                <div>
                                    <h3 className="font-bold text-[var(--text-primary)]">{post.title}</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        {post.publishDate} • {post.readTime} • <span className={`${post.status === 'published' ? 'text-green-500' : 'text-yellow-500'}`}>{post.status}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button onClick={() => openEdit(post)} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full text-blue-400"><Pencil className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full text-red-400"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isEditing && (
                <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 backdrop-blur-sm">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="w-full max-w-3xl rounded-2xl bg-[var(--bg-secondary)] p-6 shadow-2xl border border-[var(--border-color)] animate-scale-up relative">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">{currentPost.id ? 'Edit Post' : 'New Post'}</h2>
                                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Title</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none"
                                            value={currentPost.title || ''}
                                            onChange={e => handleTitleChange(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none font-mono text-sm"
                                            value={currentPost.slug || ''}
                                            onChange={e => setCurrentPost({ ...currentPost, slug: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Excerpt</label>
                                    <textarea
                                        className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none h-20"
                                        value={currentPost.excerpt || ''}
                                        onChange={e => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Content (Markdown supported)</label>
                                    <textarea
                                        className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none h-60 font-mono text-sm"
                                        value={currentPost.content || ''}
                                        onChange={e => setCurrentPost({ ...currentPost, content: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Featured Image URL (Optional)</label>
                                    <input
                                        type="url"
                                        className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none"
                                        placeholder="https://example.com/image.jpg"
                                        value={currentPost.imageUrl || ''}
                                        onChange={e => setCurrentPost({ ...currentPost, imageUrl: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Publish Date</label>
                                        <input
                                            type="date"
                                            className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none"
                                            value={currentPost.publishDate || ''}
                                            onChange={e => setCurrentPost({ ...currentPost, publishDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Read Time</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none"
                                            value={currentPost.readTime || ''}
                                            onChange={e => setCurrentPost({ ...currentPost, readTime: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Status</label>
                                        <select
                                            className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none"
                                            value={currentPost.status || 'draft'}
                                            onChange={e => setCurrentPost({ ...currentPost, status: e.target.value as ContentStatus })}
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Linked Artwork (Optional)</label>
                                        <select
                                            className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none"
                                            value={currentPost.linkedArtworkId || ''}
                                            onChange={e => setCurrentPost({ ...currentPost, linkedArtworkId: e.target.value })}
                                        >
                                            <option value="">None</option>
                                            {artworks.map(art => (
                                                <option key={art.id} value={art.id}>{art.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-color)]">
                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">Cancel</button>
                                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Save Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
            )
            }
        </>
    );
}
