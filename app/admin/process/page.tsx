'use client';

import { useState } from 'react';
import { useProcessEntries, useArtworks } from '@/hooks';
import { ProcessEntry } from '@/types/process';
import { Plus, Pencil, Trash2, Video, List, X, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function ProcessAdminPage() {
    const { entries: processes, loading: processLoading, createEntry, updateEntry, deleteEntry } = useProcessEntries();
    const { artworks, loading: artworksLoading } = useArtworks();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<ProcessEntry | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState<{
        artworkId: string;
        youtubeShortUrl: string;
        processNotes: string;
        stepLabels: string[];
        visibility: 'draft' | 'published';
    }>({
        artworkId: '',
        youtubeShortUrl: '',
        processNotes: '',
        stepLabels: ['Concept', 'Sketch', 'Line Art', 'Coloring'],
        visibility: 'draft',
    });

    const loading = processLoading || artworksLoading;

    // Helper to get artwork details
    const getArtwork = (id: string) => artworks.find(a => a.id === id);

    const openModal = (entry?: ProcessEntry) => {
        if (entry) {
            setEditingEntry(entry);
            setFormData({
                artworkId: entry.artworkId,
                youtubeShortUrl: entry.youtubeShortUrl,
                processNotes: entry.processNotes,
                stepLabels: entry.stepLabels || [],
                visibility: entry.visibility,
            });
        } else {
            setEditingEntry(null);
            setFormData({
                artworkId: '',
                youtubeShortUrl: '',
                processNotes: '',
                stepLabels: ['Concept', 'Sketch', 'Line Art', 'Coloring'],
                visibility: 'draft',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingEntry(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingEntry) {
                await updateEntry(editingEntry.id, formData);
            } else {
                await createEntry(formData);
            }
            closeModal();
        } catch (error) {
            console.error('Error saving process entry:', error);
            alert('Failed to save process entry');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this process entry?')) return;
        try {
            await deleteEntry(id);
        } catch (error) {
            console.error('Error deleting process entry:', error);
            alert('Failed to delete process entry');
        }
    };

    const addStep = () => {
        setFormData({ ...formData, stepLabels: [...formData.stepLabels, ''] });
    };

    const removeStep = (index: number) => {
        const newSteps = formData.stepLabels.filter((_, i) => i !== index);
        setFormData({ ...formData, stepLabels: newSteps });
    };

    const updateStep = (index: number, value: string) => {
        const newSteps = [...formData.stepLabels];
        newSteps[index] = value;
        setFormData({ ...formData, stepLabels: newSteps });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                        <Video className="w-8 h-8 text-[var(--accent-primary)]" />
                        Process Breakdown
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Manage behind-the-scenes content and videos
                    </p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Entry
                </button>
            </div>

            {/* List */}
            {processes.length === 0 ? (
                <div className="card p-12 text-center">
                    <Video className="w-16 h-16 mx-auto text-[var(--text-tertiary)] mb-4" />
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Process Entries</h3>
                    <p className="text-[var(--text-secondary)] mb-6">Create your first process breakdown video.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {processes.map((entry: ProcessEntry) => {
                        const art = getArtwork(entry.artworkId);
                        return (
                            <div key={entry.id} className="card p-6 flex flex-col md:flex-row gap-6">
                                {/* Thumbnail */}
                                <div className="w-full md:w-64 h-40 bg-[var(--bg-tertiary)] rounded-xl overflow-hidden relative flex-shrink-0">
                                    {art ? (
                                        <Image
                                            src={art.imageUrl}
                                            alt={art.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-[var(--text-tertiary)]">
                                            <ImageIcon className="w-8 h-8" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white">
                                        {entry.visibility}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                                        {art?.title || 'Unknown Artwork'}
                                    </h3>
                                    <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">
                                        {entry.processNotes}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {entry.stepLabels?.map((step: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-[var(--bg-tertiary)] rounded text-xs text-[var(--text-secondary)]">
                                                {step}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => openModal(entry)}
                                            className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-2"
                                        >
                                            <Pencil className="w-4 h-4" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(entry.id)}
                                            className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 backdrop-blur-sm">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="w-full max-w-2xl rounded-2xl bg-[var(--bg-secondary)] p-6 shadow-2xl border border-[var(--border-color)] animate-scale-up relative">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                                    {editingEntry ? 'Edit Process Entry' : 'New Process Entry'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-[var(--bg-tertiary)] rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Artwork Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                        Linked Artwork
                                    </label>
                                    <select
                                        value={formData.artworkId}
                                        onChange={(e) => setFormData({ ...formData, artworkId: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                                    >
                                        <option value="">Select Artwork...</option>
                                        {artworks.map((art) => (
                                            <option key={art.id} value={art.id}>
                                                {art.title} ({art.category})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Video URL */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                        YouTube URL (Video or Short)
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.youtubeShortUrl}
                                        onChange={(e) => setFormData({ ...formData, youtubeShortUrl: e.target.value })}
                                        placeholder="https://youtube.com/..."
                                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                                    />
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                        Process Breakdown Notes
                                    </label>
                                    <textarea
                                        value={formData.processNotes}
                                        onChange={(e) => setFormData({ ...formData, processNotes: e.target.value })}
                                        rows={4}
                                        required
                                        placeholder="Explain the creative process..."
                                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                                    />
                                </div>

                                {/* Steps */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-[var(--text-primary)]">
                                            Process Steps
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addStep}
                                            className="text-sm text-[var(--accent-primary)] hover:underline flex items-center gap-1"
                                        >
                                            <Plus className="w-3 h-3" /> Add Step
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.stepLabels.map((step, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={step}
                                                    onChange={(e) => updateStep(index, e.target.value)}
                                                    placeholder={`Step ${index + 1}`}
                                                    className="flex-1 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeStep(index)}
                                                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Visibility */}
                                <div className="flex items-center gap-3 pt-2">
                                    <label className="text-sm font-medium text-[var(--text-primary)]">Visibility:</label>
                                    <div className="flex bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border-primary)]">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, visibility: 'draft' })}
                                            className={`px-3 py-1 text-sm rounded-md transition-all ${formData.visibility === 'draft' ? 'bg-[var(--bg-tertiary)] shadow-sm' : 'text-[var(--text-secondary)]'}`}
                                        >
                                            Draft
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, visibility: 'published' })}
                                            className={`px-3 py-1 text-sm rounded-md transition-all ${formData.visibility === 'published' ? 'bg-green-500/10 text-green-600 font-medium shadow-sm' : 'text-[var(--text-secondary)]'}`}
                                        >
                                            Published
                                        </button>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-color)]">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="btn-primary flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        {submitting ? 'Saving...' : 'Save Entry'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
