/**
 * Utility functions for the portfolio application
 */

// Default placeholder images using placehold.co (no dummy content)
export const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/1a1a2e/4ade80?text=Add+Artwork';
export const AVATAR_PLACEHOLDER = 'https://placehold.co/200x200/1a1a2e/4ade80?text=Add+Photo';

/**
 * Simple utility to merge class names (fallback since clsx/tailwind-merge might not be installed)
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
    return inputs.filter(Boolean).join(' ');
}

/**
 * IMAGE SOURCE GUIDE:
 * 
 * 1. UNSPLASH - Just use the direct URL from Unsplash:
 *    https://images.unsplash.com/photo-XXXXXX
 * 
 * 2. GOOGLE DRIVE - Convert sharing link to direct URL:
 *    Original: https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing
 *    Convert to: https://lh3.googleusercontent.com/d/{FILE_ID}
 *    Use the convertGoogleDriveUrl() function below
 * 
 * 3. IMGUR - Use direct image link:
 *    https://i.imgur.com/{ID}.jpg
 * 
 * 4. CLOUDINARY:
 *    https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}
 * 
 * 5. IMGBB:
 *    https://i.ibb.co/{ID}/{filename}
 */

/**
 * Converts a Google Drive sharing URL to a direct image URL
 * @param driveUrl - The Google Drive sharing URL (e.g., https://drive.google.com/file/d/FILE_ID/view)
 * @returns Direct image URL that can be used in <img> tags
 */
export function convertGoogleDriveUrl(driveUrl: string): string {
    if (!driveUrl) return '';

    // If it's already a thumbnail URL, return as-is
    if (driveUrl.includes('drive.google.com/thumbnail')) {
        return driveUrl;
    }

    // If it's already a direct Google content URL, convert to thumbnail for reliability
    if (driveUrl.includes('lh3.googleusercontent.com/d/')) {
        const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
            return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
        }
        return driveUrl;
    }

    // Extract file ID from various Google Drive URL formats
    const patterns = [
        /\/file\/d\/([a-zA-Z0-9_-]+)/,  // /file/d/{id}/view
        /id=([a-zA-Z0-9_-]+)/,           // ?id={id}
        /\/d\/([a-zA-Z0-9_-]+)/,         // /d/{id}
    ];

    for (const pattern of patterns) {
        const match = driveUrl.match(pattern);
        if (match && match[1]) {
            // Use thumbnail endpoint - more reliable and less prone to rate limiting
            return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
        }
    }

    // If no pattern matched, return original URL
    return driveUrl;
}

/**
 * Converts an Unsplash page URL to a direct image URL
 * @param unsplashUrl - The Unsplash photo page URL
 * @param width - Desired width (default 800)
 * @returns Direct image URL
 */
export function convertUnsplashUrl(unsplashUrl: string, width: number = 800): string {
    if (!unsplashUrl) return '';

    // If it's already a direct image URL, return as-is
    if (unsplashUrl.includes('images.unsplash.com')) {
        return unsplashUrl;
    }

    // Extract photo ID from unsplash.com/photos/{id}
    const match = unsplashUrl.match(/unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        return `https://images.unsplash.com/photo-${match[1]}?w=${width}&fit=crop`;
    }

    return unsplashUrl;
}

/**
 * Processes an image URL to ensure it's in the correct format
 * Automatically converts Google Drive and Unsplash URLs
 */
export function processImageUrl(url: string): string {
    if (!url || url.trim() === '') return '';

    // Auto-convert Google Drive URLs
    if (url.includes('drive.google.com')) {
        return convertGoogleDriveUrl(url);
    }

    // Auto-convert Unsplash page URLs
    if (url.includes('unsplash.com/photos/')) {
        return convertUnsplashUrl(url);
    }

    return url;
}

/**
 * Returns a valid image URL with fallback to placeholder
 */
export function getImageUrl(cdnUrl?: string | null, imageUrl?: string | null, id?: string): string {
    // Try cdnUrl first, then imageUrl
    const rawUrl = cdnUrl || imageUrl;

    // If we have a valid URL (not empty string, null, or undefined)
    if (rawUrl && rawUrl.trim() !== '') {
        return processImageUrl(rawUrl);
    }

    // Return a placeholder with the ID embedded for uniqueness
    return id
        ? `https://placehold.co/600x400/1a1a2e/4ade80?text=${encodeURIComponent((id).slice(0, 8))}`
        : PLACEHOLDER_IMAGE;
}

/**
 * Check if an artwork has a valid displayable image
 */
export function hasValidImage(cdnUrl?: string | null, imageUrl?: string | null): boolean {
    const url = cdnUrl || imageUrl;
    return Boolean(url && url.trim() !== '');
}

/**
 * Returns a valid avatar/profile image URL with fallback to placeholder
 */
export function getAvatarUrl(imageUrl?: string | null, id?: string): string {
    // If we have a valid URL (not empty string, null, or undefined)
    if (imageUrl && imageUrl.trim() !== '') {
        return processImageUrl(imageUrl);
    }

    // Return placeholder
    return id
        ? `https://placehold.co/200x200/1a1a2e/4ade80?text=${encodeURIComponent(id.slice(0, 3))}`
        : AVATAR_PLACEHOLDER;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3).trim() + '...';
}
