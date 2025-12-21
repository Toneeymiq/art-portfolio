import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      // Placeholder for fallback images
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // Legacy placeholder support
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      // Unsplash - High quality free images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      // Google Drive - Direct image links
      // Use format: https://lh3.googleusercontent.com/d/{FILE_ID}
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      // Google Photos
      {
        protocol: 'https',
        hostname: 'lh3.google.com',
      },
      // Imgur - Popular image hosting
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'imgur.com',
      },
      // Cloudinary - Professional CDN
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // imgBB - Free image hosting
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      // Discord CDN (for shared images)
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
      // Instagram CDN
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com',
      },
      // DeviantArt
      {
        protocol: 'https',
        hostname: 'images-wixmp-*.wixmp.com',
      },
      // ArtStation
      {
        protocol: 'https',
        hostname: 'cdna.artstation.com',
      },
      {
        protocol: 'https',
        hostname: 'cdnb.artstation.com',
      },
      // Firebase Storage
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};

export default nextConfig;
