'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { CommissionInfo } from '@/types/commission';
import { Save, Briefcase, CheckCircle } from 'lucide-react';
import { AdminCommissionsSkeleton } from '@/components/SkeletonLoaders';

export default function AdminCommissions() {
    const [info, setInfo] = useState<Partial<CommissionInfo>>({
        servicesOffered: [],
        workflowDescription: '',
        pricingNotes: '',
        turnaroundTime: '',
        paymentMethods: '',
        status: 'active',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchInfo() {
            try {
                const docRef = doc(db, 'site_content', 'commissions');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setInfo(docSnap.data() as CommissionInfo);
                }
            } catch (error) {
                console.error("Error fetching commission info:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchInfo();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const docRef = doc(db, 'site_content', 'commissions');
            await setDoc(docRef, {
                ...info,
                // Ensure array is array
                servicesOffered: typeof info.servicesOffered === 'string' ? (info.servicesOffered as string).split('\n').filter(Boolean) : info.servicesOffered,
                updatedAt: serverTimestamp(),
            });
            // Re-read strictly to handle array conversion if needed for UI state
            alert('Commission info updated!');
        } catch (e) {
            console.error(e);
            alert('Error saving info');
        }
        setSaving(false);
    };

    const handleServicesChange = (val: string) => {
        // We keep it as string in state for textarea editing, will parse on save if desired
        // But standard practice: use local state for inputs
        // For simplicity here, we assume the textarea modifies a "string" representation if we cast it, 
        // but let's do it properly.
    };

    if (loading) return <AdminCommissionsSkeleton />;

    // Convert array to string for textarea
    const servicesString = Array.isArray(info.servicesOffered)
        ? info.servicesOffered.join('\n')
        : (info.servicesOffered || '');

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Commission Info</h1>
                    <p className="text-[var(--text-secondary)]">Manage your services, pricing, and terms.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2"
                >
                    {saving ? <div className="spinner-sm" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="card p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                        <div className="flex items-center gap-3 mb-4">
                            <Briefcase className="w-5 h-5 text-[var(--accent-primary)]" />
                            <h2 className="font-bold text-lg">Service Status</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Commission Status</label>
                                <select
                                    className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none"
                                    value={info.status || 'active'}
                                    onChange={e => setInfo({ ...info, status: e.target.value as any })}
                                >
                                    <option value="active">Open for Commissions</option>
                                    <option value="inactive">Closed / Waitlist</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Turnaround Time</label>
                                <input
                                    type="text"
                                    className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none"
                                    value={info.turnaroundTime || ''}
                                    onChange={e => setInfo({ ...info, turnaroundTime: e.target.value })}
                                    placeholder="e.g. 2-4 weeks"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                        <h2 className="font-bold text-lg mb-4">Services Offered</h2>
                        <p className="text-xs text-[var(--text-secondary)] mb-2">One service per line.</p>
                        <textarea
                            className="w-full p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none h-40 font-mono text-sm"
                            value={servicesString}
                            onChange={e => setInfo({ ...info, servicesOffered: e.target.value.split('\n') })}
                            placeholder="Character Illustration&#10;Concept Art&#10;Book Covers"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                        <h2 className="font-bold text-lg mb-4">Workflow & Terms</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Workflow Description</label>
                                <textarea
                                    className="w-full p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none h-32"
                                    value={info.workflowDescription || ''}
                                    onChange={e => setInfo({ ...info, workflowDescription: e.target.value })}
                                    placeholder="Describe how you work with clients..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Pricing Notes</label>
                                <textarea
                                    className="w-full p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none h-24"
                                    value={info.pricingNotes || ''}
                                    onChange={e => setInfo({ ...info, pricingNotes: e.target.value })}
                                    placeholder="Base prices start at..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Payment Methods</label>
                                <input
                                    type="text"
                                    className="w-full p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] outline-none"
                                    value={info.paymentMethods || ''}
                                    onChange={e => setInfo({ ...info, paymentMethods: e.target.value })}
                                    placeholder="PayPal, Stripe, Wire Transfer"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
