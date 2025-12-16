# Art Portfolio

A modern art portfolio built with Next.js, featuring a masonry gallery, lightbox views, and CMS integration with Firestore.

## Features

- Masonry gallery layout
- Lightbox image viewer
- Dark/light theme toggle
- Responsive design
- Accessibility features
- Google Drive integration for image storage
- CDN optimization pipeline

## Setup

1. Install dependencies: `npm install`
2. Set up Firebase project and add config to `.env.local`
3. Set up Google Drive API credentials
4. Run the sync script: `node scripts/sync-drive.js`
5. Start development server: `npm run dev`

## Environment Variables

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- etc.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `node scripts/sync-drive.js` - Sync images from Drive to CDN
