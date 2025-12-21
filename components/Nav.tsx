'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import { useLoading } from './TopLoader';
import { X, Palette, Briefcase, FileText, User, Mail, Sparkles, Menu as MenuIcon } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/', icon: <Sparkles className="w-5 h-5" /> },
  { name: 'Portfolio', href: '/portfolio', icon: <Palette className="w-5 h-5" /> },
  { name: 'Commissions', href: '/commissions', icon: <Briefcase className="w-5 h-5" /> },
  { name: 'Posts', href: '/posts', icon: <FileText className="w-5 h-5" /> },
  { name: 'About', href: '/about', icon: <User className="w-5 h-5" /> },
  { name: 'Contact', href: '/contact', icon: <Mail className="w-5 h-5" /> },
];

export default function Nav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const { startLoading } = useLoading();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 300); // Small delay to prevent flickering
  };

  // Hide Nav on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center transition-all duration-300 pointer-events-none ${scrolled ? 'pt-4' : ''
        }`}
    >
      {/* Logo - Top Left */}
      <Link href="/" className="pointer-events-auto group relative z-50 flex items-center">
        <img
          src="/logo.png"
          alt="Miqk Niq Logo"
          className="h-16 md:h-25 w-auto transition-all duration-500 ease-out group-hover:scale-105 drop-shadow-sm"
        />
      </Link>

      {/* Right Side - Controls & Popover Menu */}
      <div
        ref={navRef}
        className="relative pointer-events-auto flex flex-col items-end"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Controls Container */}
        <div className="bg-[var(--glass-bg)] backdrop-blur-md rounded-full p-2 border border-[var(--glass-border)] shadow-sm flex items-center gap-2 transition-all duration-300 hover:shadow-md">
          <ThemeToggle />
          <div className="w-px h-6 bg-[var(--border-primary)] mx-1"></div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] transition-colors group"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 animate-scale-in" />
            ) : (
              <MenuIcon className="w-6 h-6 group-hover:animate-wiggle" />
            )}
          </button>
        </div>

        {/* Popover Menu */}
        <div
          className={`absolute top-full right-0 mt-4 w-64 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl shadow-xl overflow-hidden transition-all duration-300 origin-top-right ${isMenuOpen
            ? 'opacity-100 scale-100 translate-y-0 visible'
            : 'opacity-0 scale-95 -translate-y-2 invisible'
            }`}
        >
          <div className="flex flex-col py-2">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  setIsMenuOpen(false);
                  startLoading();
                }}
                className={`group flex items-center gap-3 px-6 py-3 hover:bg-[var(--bg-tertiary)]/50 transition-all duration-300 ease-out relative overflow-hidden`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="text-[var(--accent-primary)] group-hover:scale-110 transition-transform duration-300 ease-out">
                  {item.icon}
                </div>
                <span
                  className={`text-xl font-dancing relative z-10 ${pathname === item.href
                    ? 'text-[var(--accent-primary)]'
                    : 'text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]'
                    } transition-colors duration-300`}
                >
                  {item.name}
                  {/* Underline animation */}
                  <span className={`absolute left-0 -bottom-0.5 h-0.5 bg-[var(--accent-primary)] transition-all duration-300 ease-out ${pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </span>

                {/* Active Indicator Dot */}
                {pathname === item.href && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--accent-primary)] rounded-r-full" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}