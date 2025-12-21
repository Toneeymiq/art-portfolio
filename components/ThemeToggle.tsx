'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] opacity-50 cursor-wait">
        <Sun className="h-5 w-5 text-gray-400" />
        <span className="text-sm font-medium text-[var(--text-primary)]">Loading</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
    >
      <Sun className="h-5 w-5 text-yellow-500" />
      <span className="text-sm font-medium text-[var(--text-primary)]">
        {theme === 'dark' ? 'Light' : 'Dark'}
      </span>
      <Moon className="h-5 w-5 text-blue-500" />
    </button>
  );
}