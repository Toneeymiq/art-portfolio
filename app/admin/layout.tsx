'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LayoutDashboard, Image as ImageIcon, FileText, Settings, LogOut, Home, Briefcase, Users, Mail, RefreshCw } from 'lucide-react';

import ThemeToggle from '../../components/ThemeToggle';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [syncing, setSyncing] = useState(false);

    const handleSync = async () => {
        setSyncing(true);
        try {
            const res = await fetch('/api/admin/sync', { method: 'POST' });
            if (res.ok) {
                // Optional: Show a toast or success message
                alert('Site cache synced successfully!');
            } else {
                alert('Failed to sync site');
            }
        } catch (error) {
            console.error('Sync failed:', error);
            alert('Error syncing site');
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="h-screen bg-[var(--bg-primary)] flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex-none hidden md:flex flex-col z-10">
                <div className="p-6 border-b border-[var(--border-color)] flex-none">
                    <span className="text-xl font-bold text-[var(--accent-primary)] font-dancing">
                        CMS Panel
                    </span>
                </div>

                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] rounded-lg transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        href="/admin/artworks"
                        className="flex items-center gap-3 px-4 py-3 text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] rounded-lg transition-colors"
                    >
                        <ImageIcon className="w-5 h-5" />
                        <span>Artworks</span>
                    </Link>

                    <Link
                        href="/admin/posts"
                        className="flex items-center gap-3 px-4 py-3 text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] rounded-lg transition-colors"
                    >
                        <FileText className="w-5 h-5" />
                        <span>Blog Posts</span>
                    </Link>

                    <Link
                        href="/admin/process"
                        className="flex items-center gap-3 px-4 py-3 text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] rounded-lg transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                        <span>Process</span>
                    </Link>

                    <Link
                        href="/admin/commissions"
                        className="flex items-center gap-3 px-4 py-3 text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] rounded-lg transition-colors"
                    >
                        <Briefcase className="w-5 h-5" />
                        <span>Commissions</span>
                    </Link>

                    <Link
                        href="/admin/staff"
                        className="flex items-center gap-3 px-4 py-3 text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] rounded-lg transition-colors"
                    >
                        <Users className="w-5 h-5" />
                        <span>Staff</span>
                    </Link>

                    <Link
                        href="/admin/messages"
                        className="flex items-center gap-3 px-4 py-3 text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] rounded-lg transition-colors"
                    >
                        <Mail className="w-5 h-5" />
                        <span>Messages</span>
                    </Link>

                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] rounded-lg transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                    </Link>

                    {/* Sync Button */}
                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[var(--text-secondary)] hover:bg-blue-500/10 hover:text-blue-500 rounded-lg transition-colors text-left"
                    >
                        <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                        <span>{syncing ? 'Syncing...' : 'Sync Site'}</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-[var(--border-color)] flex-none">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-[var(--text-secondary)] hover:text-red-400 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Exit CMS</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col h-full min-w-0">
                {/* Top Admin Header */}
                <header className="h-16 border-b border-[var(--border-color)] px-8 flex items-center justify-between bg-[var(--bg-secondary)] z-20 flex-none">
                    {/* Logo / Brand */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="md:hidden">
                            <span className="text-xl font-bold text-[var(--accent-primary)] font-dancing">Miqk Niq</span>
                        </Link>
                        <div className="hidden md:block text-sm text-[var(--text-secondary)]">
                            Welcome back, Artist
                        </div>
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-[var(--bg-tertiary)] rounded-full text-xs text-[var(--text-secondary)]">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span>System Online</span>
                        </div>
                        <div className="h-6 w-px bg-[var(--border-color)] mx-1"></div>
                        <ThemeToggle />
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto scrollbar-thin">
                    {children}
                </main>
            </div>
        </div>
    );
}
