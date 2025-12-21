'use client';

import Link from 'next/link';
import { useSettings } from '@/hooks';
import { Instagram, Twitter, MessageCircle, Mail, Palette, Video, Share2, Linkedin, Globe } from 'lucide-react';

export default function Footer() {
    const { settings } = useSettings();

    const socialIcons: Record<string, any> = {
        Instagram,
        Twitter,
        Facebook: MessageCircle,
        Discord: MessageCircle,
        Email: Mail,
        ArtStation: Palette,
        DeviantArt: Palette,
        Behance: Palette,
        YouTube: Video,
        TikTok: Video,
        LinkedIn: Linkedin,
        Default: Globe,
    };

    return (
        <footer className="bg-[var(--bg-secondary)] py-12 border-t border-[var(--border-primary)] mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <p className="text-2xl font-bold text-[var(--text-primary)] font-accent">
                            {settings?.siteTitle || 'Miqk Niq'}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                            {settings?.siteDescription || 'Digital Artist & Illustrator'}
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-wrap justify-center gap-6">
                        {['Portfolio', 'Commissions', 'Posts', 'Contact'].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase()}`}
                                className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors font-medium"
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>

                    {/* Social links */}
                    <div className="flex flex-wrap justify-center md:justify-end gap-3">
                        {settings?.socialLinks?.filter(link => link.url && link.url !== '#').map((link, index) => {
                            const IconComp = socialIcons[link.platform] || socialIcons.Default;
                            return (
                                <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-white hover:bg-[var(--accent-primary)] transition-all duration-300"
                                >
                                    <IconComp className="w-4 h-4" />
                                    <span className="text-sm font-medium">{link.platform}</span>
                                </a>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[var(--border-primary)] flex justify-center items-center">
                    <p className="text-sm text-[var(--text-tertiary)] text-center">
                        © {new Date().getFullYear()} {settings?.siteTitle || 'Miqk Niq'} - All Rights Reserved
                    </p>
                </div>
            </div>
        </footer>
    );
}
