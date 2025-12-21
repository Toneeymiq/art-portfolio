'use client';

import { useState } from 'react';
import { useStaff } from '@/hooks';
import { StaffMember } from '@/types/staff';
import { Plus, Pencil, Trash2, User, Users, X, Save, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { AdminStaffSkeleton } from '@/components/SkeletonLoaders';

export default function StaffAdminPage() {
    const { staff, loading, createMember, updateMember, deleteMember, refetch } = useStaff();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        imageUrl: '',
        bio: '',
        order: 1,
        isActive: true,
    });

    const openModal = (member?: StaffMember) => {
        if (member) {
            setEditingMember(member);
            setFormData({
                name: member.name,
                role: member.role,
                imageUrl: member.imageUrl,
                bio: member.bio || '',
                order: member.order,
                isActive: member.isActive,
            });
        } else {
            setEditingMember(null);
            setFormData({
                name: '',
                role: '',
                imageUrl: '',
                bio: '',
                order: staff.length + 1,
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMember(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingMember) {
                await updateMember(editingMember.id, formData);
            } else {
                await createMember(formData);
            }
            closeModal();
        } catch (error) {
            console.error('Error saving staff member:', error);
            alert('Failed to save staff member');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (member: StaffMember) => {
        if (!confirm(`Are you sure you want to delete "${member.name}"?`)) return;

        try {
            await deleteMember(member.id);
        } catch (error) {
            console.error('Error deleting staff member:', error);
            alert('Failed to delete staff member');
        }
    };

    const handleToggleActive = async (member: StaffMember) => {
        try {
            await updateMember(member.id, { isActive: !member.isActive });
        } catch (error) {
            console.error('Error updating staff member:', error);
        }
    };

    if (loading) {
        return <AdminStaffSkeleton />;
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                        <Users className="w-8 h-8 text-[var(--accent-primary)]" />
                        Staff Management
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Manage team members displayed on the website
                    </p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Staff Member
                </button>
            </div>

            {/* Staff List */}
            {staff.length === 0 ? (
                <div className="card p-12 text-center">
                    <User className="w-16 h-16 mx-auto text-[var(--text-tertiary)] mb-4" />
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                        No Staff Members Yet
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-6">
                        Add your first team member to display on the website.
                    </p>
                    <button
                        onClick={() => openModal()}
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Staff Member
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staff.map((member) => (
                        <div
                            key={member.id}
                            className={`card p-6 ${!member.isActive ? 'opacity-60' : ''}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-[var(--accent-primary)]/30 flex-shrink-0">
                                    <Image
                                        src={member.imageUrl || 'https://picsum.photos/100/100?random=staff'}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-[var(--text-primary)] truncate">
                                        {member.name}
                                    </h3>
                                    <p className="text-sm text-[var(--accent-primary)]">
                                        {member.role}
                                    </p>
                                    {member.bio && (
                                        <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2">
                                            {member.bio}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-3">
                                        <span className={`text-xs px-2 py-1 rounded-full ${member.isActive
                                            ? 'bg-green-500/10 text-green-600'
                                            : 'bg-gray-500/10 text-gray-500'
                                            }`}>
                                            {member.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className="text-xs text-[var(--text-tertiary)]">
                                            Order: {member.order}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--border-primary)]">
                                <button
                                    onClick={() => handleToggleActive(member)}
                                    className="flex-1 py-2 px-3 text-sm rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-colors"
                                >
                                    {member.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                    onClick={() => openModal(member)}
                                    className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(member)}
                                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-[var(--bg-primary)] rounded-2xl shadow-2xl animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
                            <h2 className="text-xl font-bold text-[var(--text-primary)]">
                                {editingMember ? 'Edit Staff Member' : 'Add Staff Member'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                    Role *
                                </label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                                    placeholder="Lead Artist"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                    Profile Image URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                                    placeholder="https://example.com/photo.jpg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                    Bio
                                </label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] resize-none"
                                    placeholder="Short bio..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                                        min={1}
                                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <label className="flex items-center gap-3 cursor-pointer mt-6">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="w-5 h-5 rounded border-[var(--border-primary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                                        />
                                        <span className="text-sm text-[var(--text-primary)]">Active</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-3 px-4 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-xl font-medium hover:bg-[var(--bg-secondary)] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Save className="w-5 h-5" />
                                    )}
                                    {submitting ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
