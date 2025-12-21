module.exports = [
"[project]/lib/utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utility functions for the portfolio application
 */ // Default placeholder images using placehold.co (no dummy content)
__turbopack_context__.s([
    "AVATAR_PLACEHOLDER",
    ()=>AVATAR_PLACEHOLDER,
    "PLACEHOLDER_IMAGE",
    ()=>PLACEHOLDER_IMAGE,
    "cn",
    ()=>cn,
    "convertGoogleDriveUrl",
    ()=>convertGoogleDriveUrl,
    "convertUnsplashUrl",
    ()=>convertUnsplashUrl,
    "formatDate",
    ()=>formatDate,
    "getAvatarUrl",
    ()=>getAvatarUrl,
    "getImageUrl",
    ()=>getImageUrl,
    "hasValidImage",
    ()=>hasValidImage,
    "processImageUrl",
    ()=>processImageUrl,
    "truncateText",
    ()=>truncateText
]);
const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/1a1a2e/4ade80?text=Add+Artwork';
const AVATAR_PLACEHOLDER = 'https://placehold.co/200x200/1a1a2e/4ade80?text=Add+Photo';
function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}
function convertGoogleDriveUrl(driveUrl) {
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
        /\/file\/d\/([a-zA-Z0-9_-]+)/,
        /id=([a-zA-Z0-9_-]+)/,
        /\/d\/([a-zA-Z0-9_-]+)/
    ];
    for (const pattern of patterns){
        const match = driveUrl.match(pattern);
        if (match && match[1]) {
            // Use thumbnail endpoint - more reliable and less prone to rate limiting
            return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
        }
    }
    // If no pattern matched, return original URL
    return driveUrl;
}
function convertUnsplashUrl(unsplashUrl, width = 800) {
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
function processImageUrl(url) {
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
function getImageUrl(cdnUrl, imageUrl, id) {
    // Try cdnUrl first, then imageUrl
    const rawUrl = cdnUrl || imageUrl;
    // If we have a valid URL (not empty string, null, or undefined)
    if (rawUrl && rawUrl.trim() !== '') {
        return processImageUrl(rawUrl);
    }
    // Return a placeholder with the ID embedded for uniqueness
    return id ? `https://placehold.co/600x400/1a1a2e/4ade80?text=${encodeURIComponent(id.slice(0, 8))}` : PLACEHOLDER_IMAGE;
}
function hasValidImage(cdnUrl, imageUrl) {
    const url = cdnUrl || imageUrl;
    return Boolean(url && url.trim() !== '');
}
function getAvatarUrl(imageUrl, id) {
    // If we have a valid URL (not empty string, null, or undefined)
    if (imageUrl && imageUrl.trim() !== '') {
        return processImageUrl(imageUrl);
    }
    // Return placeholder
    return id ? `https://placehold.co/200x200/1a1a2e/4ade80?text=${encodeURIComponent(id.slice(0, 3))}` : AVATAR_PLACEHOLDER;
}
function formatDate(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3).trim() + '...';
}
}),
"[project]/components/Skeleton.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-rsc] (ecmascript)");
;
;
function Skeleton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])("animate-pulse rounded-md bg-[var(--bg-tertiary)]/50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/Skeleton.tsx",
        lineNumber: 8,
        columnNumber: 9
    }, this);
}
;
}),
"[project]/app/loading.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Loading
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Skeleton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Skeleton.tsx [app-rsc] (ecmascript)");
;
;
function Loading() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center items-center min-h-[50vh]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Skeleton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Skeleton"], {
                    className: "h-12 w-12 rounded-full"
                }, void 0, false, {
                    fileName: "[project]/app/loading.tsx",
                    lineNumber: 7,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Skeleton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Skeleton"], {
                    className: "h-4 w-48"
                }, void 0, false, {
                    fileName: "[project]/app/loading.tsx",
                    lineNumber: 8,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/loading.tsx",
            lineNumber: 6,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/loading.tsx",
        lineNumber: 5,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=_ac8666d4._.js.map