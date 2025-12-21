'use client';

import { useState, useEffect } from 'react';
import { useSettings } from '@/hooks';
import { Settings, Save, Plus, Trash2, Layout, DollarSign, List, Type, Loader2, User, Phone } from 'lucide-react';

export default function SettingsAdminPage() {
    const { settings, loading, updateSettings } = useSettings();
    const [formData, setFormData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'commission' | 'services' | 'pages' | 'general' | 'profile' | 'about'>('commission');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setFormData(settings);
        }
    }, [settings]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateSettings(formData);
            alert('Settings saved successfully!');
        } catch (error) {
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    // Helper for array fields (Pricing, Services)
    const updateArrayItem = (arrayField: string, index: number, field: string, value: any) => {
        const newArray = [...formData[arrayField]];
        newArray[index] = { ...newArray[index], [field]: value };
        updateField(arrayField, newArray);
    };

    const removeArrayItem = (arrayField: string, index: number) => {
        const newArray = formData[arrayField].filter((_: any, i: number) => i !== index);
        updateField(arrayField, newArray);
    };

    const addArrayItem = (arrayField: string, template: any) => {
        const newArray = [...(formData[arrayField] || []), template];
        updateField(arrayField, newArray);
    };

    if (loading || !formData) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                        <Settings className="w-8 h-8 text-[var(--accent-primary)]" />
                        Site Settings
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Manage global content, pricing, and services
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-[var(--border-primary)] overflow-x-auto pb-1">
                <button
                    onClick={() => setActiveTab('commission')}
                    className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${activeTab === 'commission'
                        ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Pricing & Process
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('services')}
                    className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${activeTab === 'services'
                        ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <List className="w-4 h-4" />
                        Services Offered
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('pages')}
                    className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${activeTab === 'pages'
                        ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Layout className="w-4 h-4" />
                        Page Content
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('about')}
                    className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${activeTab === 'about'
                        ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        About Page
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('general')}
                    className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${activeTab === 'general'
                        ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        General Content
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${activeTab === 'profile'
                        ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Profile & Contact
                    </div>
                </button>
            </div>

            {/* Content */}
            <div className="space-y-8">
                {activeTab === 'commission' && (
                    <>
                        {/* Pricing Tiers */}
                        <div className="card p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">Commission Pricing</h3>
                                <button
                                    onClick={() => addArrayItem('commissionPricing', {
                                        name: 'New Tier',
                                        price: '$0',
                                        description: 'Description',
                                        features: [],
                                        isPopular: false
                                    })}
                                    className="text-sm btn-secondary flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Add Tier
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                {formData.commissionPricing?.map((tier: any, index: number) => (
                                    <div key={index} className="bg-[var(--bg-tertiary)] p-4 rounded-xl relative group">
                                        <button
                                            onClick={() => removeArrayItem('commissionPricing', index)}
                                            className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-[var(--text-secondary)]">Tier Name</label>
                                                <input
                                                    type="text"
                                                    value={tier.name}
                                                    onChange={(e) => updateArrayItem('commissionPricing', index, 'name', e.target.value)}
                                                    className="w-full mt-1 px-3 py-2 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-primary)]"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-[var(--text-secondary)]">Price Display</label>
                                                <input
                                                    type="text"
                                                    value={tier.price}
                                                    onChange={(e) => updateArrayItem('commissionPricing', index, 'price', e.target.value)}
                                                    className="w-full mt-1 px-3 py-2 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-primary)]"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-xs text-[var(--text-secondary)]">Description</label>
                                                <input
                                                    type="text"
                                                    value={tier.description}
                                                    onChange={(e) => updateArrayItem('commissionPricing', index, 'description', e.target.value)}
                                                    className="w-full mt-1 px-3 py-2 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-primary)]"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-xs text-[var(--text-secondary)]">Features (comma separated)</label>
                                                <input
                                                    type="text"
                                                    value={tier.features?.join(', ')}
                                                    onChange={(e) => updateArrayItem('commissionPricing', index, 'features', e.target.value.split(',').map((s: string) => s.trim()))}
                                                    className="w-full mt-1 px-3 py-2 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-primary)]"
                                                    placeholder="feature 1, feature 2, feature 3"
                                                />
                                            </div>
                                            <div className="md:col-span-2 flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={tier.isPopular}
                                                    onChange={(e) => updateArrayItem('commissionPricing', index, 'isPopular', e.target.checked)}
                                                    className="w-4 h-4 rounded text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                                                />
                                                <label className="text-sm text-[var(--text-primary)]">Mark as Most Popular</label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Commission Process */}
                        <div className="card p-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Commission Process Steps</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {formData.commissionProcess?.map((step: any, index: number) => (
                                    <div key={index} className="bg-[var(--bg-tertiary)] p-4 rounded-xl flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center font-bold flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={step.title}
                                                    onChange={(e) => updateArrayItem('commissionProcess', index, 'title', e.target.value)}
                                                    className="bg-[var(--bg-primary)] px-3 py-2 rounded-lg border border-[var(--border-primary)]"
                                                    placeholder="Step Title"
                                                />
                                                <select
                                                    value={step.icon}
                                                    onChange={(e) => updateArrayItem('commissionProcess', index, 'icon', e.target.value)}
                                                    className="bg-[var(--bg-primary)] px-3 py-2 rounded-lg border border-[var(--border-primary)]"
                                                >
                                                    <option value="MessageCircle">💬 Message</option>
                                                    <option value="Palette">🎨 Palette</option>
                                                    <option value="FileImage">🖼️ File</option>
                                                    <option value="Sparkles">✨ Sparkles</option>
                                                </select>
                                            </div>
                                            <textarea
                                                value={step.description}
                                                onChange={(e) => updateArrayItem('commissionProcess', index, 'description', e.target.value)}
                                                className="w-full bg-[var(--bg-primary)] px-3 py-2 rounded-lg border border-[var(--border-primary)]"
                                                rows={2}
                                                placeholder="Step description..."
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'services' && (
                    <div className="card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">Services Offered</h3>
                            <button
                                onClick={() => addArrayItem('commissionServices', {
                                    icon: '🎨',
                                    title: 'New Service',
                                    description: 'Service description'
                                })}
                                className="text-sm btn-secondary flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Add Service
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {formData.commissionServices?.map((service: any, index: number) => (
                                <div key={index} className="bg-[var(--bg-tertiary)] p-4 rounded-xl relative group">
                                    <button
                                        onClick={() => removeArrayItem('commissionServices', index)}
                                        className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={service.icon}
                                                onChange={(e) => updateArrayItem('commissionServices', index, 'icon', e.target.value)}
                                                className="w-12 text-center bg-[var(--bg-primary)] px-2 py-2 rounded-lg border border-[var(--border-primary)]"
                                                placeholder="🎨"
                                            />
                                            <input
                                                type="text"
                                                value={service.title}
                                                onChange={(e) => updateArrayItem('commissionServices', index, 'title', e.target.value)}
                                                className="flex-1 bg-[var(--bg-primary)] px-3 py-2 rounded-lg border border-[var(--border-primary)] font-medium"
                                                placeholder="Service Title"
                                            />
                                        </div>
                                        <textarea
                                            value={service.description}
                                            onChange={(e) => updateArrayItem('commissionServices', index, 'description', e.target.value)}
                                            className="w-full bg-[var(--bg-primary)] px-3 py-2 rounded-lg border border-[var(--border-primary)] text-sm"
                                            rows={2}
                                            placeholder="Service description..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'pages' && (
                    <div className="space-y-6">
                        {/* Portfolio Page */}
                        <div className="card p-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Portfolio Page</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Page Title</label>
                                    <input
                                        type="text"
                                        value={formData.portfolioPageTitle}
                                        onChange={(e) => updateField('portfolioPageTitle', e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Page Subtitle</label>
                                    <textarea
                                        value={formData.portfolioPageSubtitle}
                                        onChange={(e) => updateField('portfolioPageSubtitle', e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Process Page */}
                        <div className="card p-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Process Page</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Page Title</label>
                                    <input
                                        type="text"
                                        value={formData.processPageTitle}
                                        onChange={(e) => updateField('processPageTitle', e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Page Subtitle</label>
                                    <textarea
                                        value={formData.processPageSubtitle}
                                        onChange={(e) => updateField('processPageSubtitle', e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Posts Page */}
                        <div className="card p-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Posts Page</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Page Title</label>
                                    <input
                                        type="text"
                                        value={formData.postsPageTitle}
                                        onChange={(e) => updateField('postsPageTitle', e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Page Subtitle</label>
                                    <textarea
                                        value={formData.postsPageSubtitle}
                                        onChange={(e) => updateField('postsPageSubtitle', e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="space-y-6">
                        {/* Hero Section */}
                        <div className="card p-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Hero Section</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Hero Image URL (Background)</label>
                                    <input
                                        type="text"
                                        value={formData.aboutHeroImage || ''}
                                        onChange={(e) => updateField('aboutHeroImage', e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={formData.aboutHeroTitle || ''}
                                        onChange={(e) => updateField('aboutHeroTitle', e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Subtitle</label>
                                    <input
                                        type="text"
                                        value={formData.aboutHeroSubtitle || ''}
                                        onChange={(e) => updateField('aboutHeroSubtitle', e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="card p-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Bio Section</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Profile Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.aboutProfileImage || ''}
                                        onChange={(e) => updateField('aboutProfileImage', e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Bio Title</label>
                                    <input
                                        type="text"
                                        value={formData.aboutBioTitle || ''}
                                        onChange={(e) => updateField('aboutBioTitle', e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Bio Text (Markdown/Text)</label>
                                    <textarea
                                        value={formData.aboutBioText || ''}
                                        onChange={(e) => updateField('aboutBioText', e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg min-h-[200px]"
                                        placeholder="Write your bio here..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Artistic Focus */}
                        <div className="card p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">Artistic Focus</h3>
                                <button
                                    onClick={() => addArrayItem('aboutArtisticFocus', {
                                        icon: '🎨',
                                        title: 'New Focus',
                                        description: 'Description'
                                    })}
                                    className="text-sm btn-secondary flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Add Focus
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {formData.aboutArtisticFocus?.map((item: any, index: number) => (
                                    <div key={index} className="bg-[var(--bg-tertiary)] p-4 rounded-xl relative group">
                                        <button
                                            onClick={() => removeArrayItem('aboutArtisticFocus', index)}
                                            className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-[var(--text-secondary)]">Icon (Emoji)</label>
                                                <input
                                                    type="text"
                                                    value={item.icon}
                                                    onChange={(e) => updateArrayItem('aboutArtisticFocus', index, 'icon', e.target.value)}
                                                    className="w-full mt-1 px-3 py-2 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-primary)] text-center"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-[var(--text-secondary)]">Title</label>
                                                <input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => updateArrayItem('aboutArtisticFocus', index, 'title', e.target.value)}
                                                    className="w-full mt-1 px-3 py-2 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-primary)]"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-xs text-[var(--text-secondary)]">Description</label>
                                                <textarea
                                                    value={item.description}
                                                    onChange={(e) => updateArrayItem('aboutArtisticFocus', index, 'description', e.target.value)}
                                                    className="w-full mt-1 px-3 py-2 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-primary)]"
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tools & Software */}
                        <div className="card p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">Tools & Software</h3>
                                <button
                                    onClick={() => addArrayItem('aboutTools', {
                                        name: 'New Tool',
                                        icon: '🛠️'
                                    })}
                                    className="text-sm btn-secondary flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Add Tool
                                </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {formData.aboutTools?.map((tool: any, index: number) => (
                                    <div key={index} className="bg-[var(--bg-tertiary)] p-3 rounded-xl relative group">
                                        <button
                                            onClick={() => removeArrayItem('aboutTools', index)}
                                            className="absolute top-1 right-1 p-1 text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                value={tool.icon}
                                                onChange={(e) => updateArrayItem('aboutTools', index, 'icon', e.target.value)}
                                                className="w-full text-center bg-[var(--bg-primary)] px-2 py-1 rounded border border-[var(--border-primary)] text-xl"
                                                placeholder="Emoji"
                                            />
                                            <input
                                                type="text"
                                                value={tool.name}
                                                onChange={(e) => updateArrayItem('aboutTools', index, 'name', e.target.value)}
                                                className="w-full text-center bg-[var(--bg-primary)] px-2 py-1 rounded border border-[var(--border-primary)] text-sm font-medium"
                                                placeholder="Tool Name"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'general' && (
                    <div className="card p-6 space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Site Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Site Title</label>
                                    <input
                                        type="text"
                                        value={formData.siteTitle}
                                        onChange={(e) => updateField('siteTitle', e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Contact Email</label>
                                    <input
                                        type="text"
                                        value={formData.contactEmail}
                                        onChange={(e) => updateField('contactEmail', e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Site Description</label>
                                    <textarea
                                        value={formData.siteDescription}
                                        onChange={(e) => updateField('siteDescription', e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-[var(--border-primary)] pt-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Commission Call-to-Action</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">CTA Title</label>
                                    <input
                                        type="text"
                                        value={formData.commissionCTATitle}
                                        onChange={(e) => updateField('commissionCTATitle', e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">CTA Description</label>
                                    <textarea
                                        value={formData.commissionCTADescription}
                                        onChange={(e) => updateField('commissionCTADescription', e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        {/* Personal Info */}
                        <div className="card p-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-[var(--accent-primary)]" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Artist Name</label>
                                    <input
                                        type="text"
                                        value={formData.artistName || ''}
                                        onChange={(e) => updateField('artistName', e.target.value)}
                                        placeholder="Your display name"
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location || ''}
                                        onChange={(e) => updateField('location', e.target.value)}
                                        placeholder="City, Country"
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Artist Bio</label>
                                    <textarea
                                        value={formData.artistBio || ''}
                                        onChange={(e) => updateField('artistBio', e.target.value)}
                                        placeholder="A brief description about yourself..."
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="card p-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-[var(--accent-primary)]" />
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phoneNumber || ''}
                                        onChange={(e) => updateField('phoneNumber', e.target.value)}
                                        placeholder="+254..."
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Timezone</label>
                                    <input
                                        type="text"
                                        value={formData.timezone || ''}
                                        onChange={(e) => updateField('timezone', e.target.value)}
                                        placeholder="EAT (UTC+3)"
                                        className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="card p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">Social Media Links</h3>
                                <button
                                    onClick={() => addArrayItem('socialLinks', { platform: 'New Platform', url: '' })}
                                    className="text-sm btn-secondary flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Add Link
                                </button>
                            </div>
                            <div className="space-y-3">
                                {formData.socialLinks?.map((link: { platform: string; url: string }, index: number) => (
                                    <div key={index} className="flex gap-3 items-center bg-[var(--bg-tertiary)] p-3 rounded-xl group">
                                        <select
                                            value={link.platform}
                                            onChange={(e) => updateArrayItem('socialLinks', index, 'platform', e.target.value)}
                                            className="w-36 px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-sm"
                                        >
                                            <option value="Instagram">Instagram</option>
                                            <option value="Twitter">Twitter/X</option>
                                            <option value="ArtStation">ArtStation</option>
                                            <option value="DeviantArt">DeviantArt</option>
                                            <option value="Behance">Behance</option>
                                            <option value="YouTube">YouTube</option>
                                            <option value="Discord">Discord</option>
                                            <option value="TikTok">TikTok</option>
                                            <option value="LinkedIn">LinkedIn</option>
                                        </select>
                                        <input
                                            type="url"
                                            value={link.url}
                                            onChange={(e) => updateArrayItem('socialLinks', index, 'url', e.target.value)}
                                            placeholder="https://..."
                                            className="flex-1 px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-sm"
                                        />
                                        <button
                                            onClick={() => removeArrayItem('socialLinks', index)}
                                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-[var(--text-tertiary)] mt-4">
                                These links will appear in the footer and contact page across your portfolio.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
