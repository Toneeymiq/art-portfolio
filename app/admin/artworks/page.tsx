'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Artwork, ArtworkCategory, ContentStatus, ArtworkMedium } from '@/types/artwork';
import { Plus, Pencil, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';
import { AdminArtworksSkeleton } from '@/components/SkeletonLoaders';

export default function AdminArtworks() {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentArtwork, setCurrentArtwork] = useState<Partial<Artwork>>({});

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'artworks'), (snap) => {
            const data = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
            })) as Artwork[];

            // Sort manually
            data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            setArtworks(data);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleSave = async () => {
        if (!currentArtwork.title) return alert('Title is required');

        try {
            const artworkData = {
                ...currentArtwork,
                tags: typeof currentArtwork.tags === 'string' ? (currentArtwork.tags as string).split(',').map(t => t.trim()) : currentArtwork.tags,
                updatedAt: serverTimestamp(),
            };

            if (currentArtwork.id) {
                // Update
                const ref = doc(db, 'artworks', currentArtwork.id);
                const { id, ...dataToUpdate } = artworkData as any; // Exclude ID from data
                await updateDoc(ref, dataToUpdate);
            } else {
                // Create
                await addDoc(collection(db, 'artworks'), {
                    ...artworkData,
                    category: artworkData.category || 'Personal',
                    visibility: artworkData.visibility || 'draft',
                    hasProcess: artworkData.hasProcess || false,
                    createdAt: serverTimestamp(),
                });
            }
            setIsEditing(false);
            setCurrentArtwork({});
        } catch (e) {
            console.error(e);
            alert('Error saving artwork');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this artwork?')) return;
        try {
            await deleteDoc(doc(db, 'artworks', id));
        } catch (e) {
            console.error(e);
            alert('Error deleting artwork');
        }
    };

    const openEdit = (art: Artwork) => {
        setCurrentArtwork({
            ...art,
            tags: (art.tags || []).join(', ') as any
        });
        setIsEditing(true);
    };

    const openNew = () => {
        setCurrentArtwork({
            title: '',
            description: '',
            imageUrl: '',
            tags: [],
            category: 'Personal',
            medium: 'Digital',
            visibility: 'published',
            hasProcess: false,
            youtubeShortUrl: '',
            processDescription: '',
        });
        setIsEditing(true);
    };

    if (loading) return <AdminArtworksSkeleton />;

    return (
        <>
            <div className="space-y-6 animate-fade-in-up">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Manage Artworks</h1>
                        <p className="text-[var(--text-secondary)]">Create and manage your portfolio pieces.</p>
                    </div>
                    <button
                        onClick={openNew}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Artwork
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {artworks.map(art => (
                        <div key={art.id} className="card group relative overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                            <div className="aspect-video relative bg-gray-800">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={getImageUrl(art.cdnUrl, art.imageUrl, art.id)} alt={art.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button onClick={() => openEdit(art)} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"><Pencil className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(art.id)} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full"><Trash2 className="w-4 h-4" /></button>
                                </div>
                                {/* Status Badge */}
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${art.visibility === 'published' ? 'bg-green-500/80 text-white' : 'bg-yellow-500/80 text-black'
                                        }`}>
                                        {art.visibility === 'published' ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-lg text-[var(--text-primary)] truncate flex-1">{art.title}</h3>
                                    {art.hasProcess && <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg">Process</span>}
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="text-sm text-[var(--text-accent)]">{art.category}</p>
                                    {art.medium && (
                                        <>
                                            <span className="text-[var(--text-tertiary)]">•</span>
                                            <p className="text-sm text-[var(--text-secondary)]">{art.medium}</p>
                                        </>
                                    )}
                                </div>
                                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">{art.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {art.tags.slice(0, 3).map(t => (
                                        <span key={t} className="text-xs px-2 py-1 bg-[var(--bg-tertiary)] rounded-full text-[var(--text-secondary)]">{t}</span>
                                    ))}
                                </div>
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
                                <h2 className="text-xl font-bold">{currentArtwork.id ? 'Edit Artwork' : 'New Artwork'}</h2>
                                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Title</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none"
                                            value={currentArtwork.title || ''}
                                            onChange={e => setCurrentArtwork({ ...currentArtwork, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Category</label>
                                            <select
                                                className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none"
                                                value={currentArtwork.category || 'Personal'}
                                                onChange={e => setCurrentArtwork({ ...currentArtwork, category: e.target.value as ArtworkCategory })}
                                            >
                                                <option value="Personal">Personal</option>
                                                <option value="Commissioned">Commissioned</option>
                                                <option value="Concept/Game Art">Concept/Game Art</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Visibility</label>
                                            <select
                                                className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none"
                                                value={currentArtwork.visibility || 'draft'}
                                                onChange={e => setCurrentArtwork({ ...currentArtwork, visibility: e.target.value as ContentStatus })}
                                            >
                                                <option value="draft">Draft</option>
                                                <option value="published">Published</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Medium</label>
                                        <select
                                            className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none"
                                            value={currentArtwork.medium || 'Digital'}
                                            onChange={e => setCurrentArtwork({ ...currentArtwork, medium: e.target.value as ArtworkMedium })}
                                        >
                                            <option value="Painting">Painting</option>
                                            <option value="Drawing">Drawing</option>
                                            <option value="Photography">Photography</option>
                                            <option value="Digital">Digital</option>
                                            <option value="Sculpture">Sculpture</option>
                                            <option value="Mixed Media">Mixed Media</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Image URL</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none"
                                            value={currentArtwork.imageUrl || ''}
                                            onChange={e => setCurrentArtwork({ ...currentArtwork, imageUrl: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Thumbnail URL (Optional)</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none"
                                            value={currentArtwork.thumbnailUrl || ''}
                                            onChange={e => setCurrentArtwork({ ...currentArtwork, thumbnailUrl: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Description</label>
                                        <textarea
                                            className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none h-32"
                                            value={currentArtwork.description || ''}
                                            onChange={e => setCurrentArtwork({ ...currentArtwork, description: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            placeholder="digital, portrait, sci-fi"
                                            className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none"
                                            value={currentArtwork.tags as any || ''}
                                            onChange={e => setCurrentArtwork({ ...currentArtwork, tags: e.target.value as any })}
                                        />
                                    </div>

                                    <div className="pt-2 flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                                                checked={currentArtwork.hasProcess || false}
                                                onChange={e => setCurrentArtwork({ ...currentArtwork, hasProcess: e.target.checked })}
                                            />
                                            <span className="text-sm font-medium">Has Process Content?</span>
                                        </label>
                                    </div>

                                    {currentArtwork.hasProcess && (
                                        <div className="animate-fade-in-up space-y-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                            <p className="text-sm text-purple-400 font-medium">Process Content</p>
                                            
                                            <div>
                                                <label className="block text-sm font-medium mb-1">YouTube Short URL (Optional)</label>
                                                <input
                                                    type="text"
                                                    placeholder="https://youtube.com/shorts/..."
                                                    className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none"
                                                    value={currentArtwork.youtubeShortUrl || ''}
                                                    onChange={e => setCurrentArtwork({ ...currentArtwork, youtubeShortUrl: e.target.value })}
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Process Description (Optional)</label>
                                                <textarea
                                                    placeholder="Describe the creative process, techniques used, inspiration, etc."
                                                    rows={4}
                                                    className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none resize-none"
                                                    value={currentArtwork.processDescription || ''}
                                                    onChange={e => setCurrentArtwork({ ...currentArtwork, processDescription: e.target.value })}
                                                />
                                                <p className="text-xs text-[var(--text-tertiary)] mt-1">This will appear alongside the YouTube Short in the lightbox.</p>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[var(--border-color)]">
                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">Cancel</button>
                                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Save Artwork
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
