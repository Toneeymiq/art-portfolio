'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Artwork } from '@/types/artwork';

interface LightboxContextType {
    isOpen: boolean;
    artwork: Artwork | null;
    openLightbox: (artwork: Artwork) => void;
    closeLightbox: () => void;
}

const LightboxContext = createContext<LightboxContextType | undefined>(undefined);

export function LightboxProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [artwork, setArtwork] = useState<Artwork | null>(null);

    const openLightbox = useCallback((artwork: Artwork) => {
        setArtwork(artwork);
        setIsOpen(true);
    }, []);

    const closeLightbox = useCallback(() => {
        setIsOpen(false);
        // Delay clearing artwork to allow exit animation
        setTimeout(() => setArtwork(null), 300);
    }, []);

    return (
        <LightboxContext.Provider value={{ isOpen, artwork, openLightbox, closeLightbox }}>
            {children}
        </LightboxContext.Provider>
    );
}

export function useLightbox() {
    const context = useContext(LightboxContext);
    if (context === undefined) {
        throw new Error('useLightbox must be used within a LightboxProvider');
    }
    return context;
}
