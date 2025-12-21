'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, createContext, useContext, ReactNode } from 'react';

type LoadingContextType = {
    startLoading: () => void;
    stopLoading: () => void;
    isLoading: boolean;
};

const LoadingContext = createContext<LoadingContextType>({
    startLoading: () => { },
    stopLoading: () => { },
    isLoading: false,
});

export const useLoading = () => useContext(LoadingContext);

export default function TopLoader({ children }: { children: ReactNode }) {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // When route changes, stop the loader (it completes the navigation)
        stopLoading();
    }, [pathname, searchParams]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isVisible) {
            // Start slightly above 0
            setProgress(10);

            interval = setInterval(() => {
                setProgress(prev => {
                    // Asymptotic approach to 90%
                    if (prev >= 90) return prev;
                    const remaining = 90 - prev;
                    const add = remaining * 0.1 * Math.random();
                    return prev + Math.max(0.5, add);
                });
            }, 200);
        } else {
            // Complete gracefully
            setProgress(100);
            const timer = setTimeout(() => {
                setProgress(0);
            }, 500);
            return () => clearTimeout(timer);
        }

        return () => clearInterval(interval);
    }, [isVisible]);

    const startLoading = () => {
        setIsVisible(true);
        setProgress(0);
    };

    const stopLoading = () => {
        setIsVisible(false);
    };

    return (
        <LoadingContext.Provider value={{ startLoading, stopLoading, isLoading: isVisible }}>
            <div
                className="fixed top-0 left-0 right-0 z-[100] pointer-events-none transition-opacity duration-500 ease-in-out"
                style={{ opacity: isVisible || progress > 0 ? 1 : 0 }}
            >
                <div
                    className="h-[3px] bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)] transition-all duration-300 ease-out"
                    style={{
                        width: `${progress}%`,
                        opacity: progress === 100 ? 0 : 1,
                        transition: progress === 100 ? 'width 0.2s ease-out, opacity 0.5s ease 0.2s' : 'width 0.3s ease-out'
                    }}
                />
            </div>
            {children}
        </LoadingContext.Provider>
    );
}
