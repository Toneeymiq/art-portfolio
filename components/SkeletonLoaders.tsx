'use client';

import React from 'react';

// Reusable skeleton component with shimmer animation
const SkeletonBase = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={`animate-pulse bg-[var(--bg-tertiary)] rounded-lg ${className}`} style={style} />
);

// Home page skeleton - Hero + sections
export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Slider Skeleton */}
      <div className="relative h-screen w-full">
        <SkeletonBase className="absolute inset-0 rounded-none" />
        {/* Hero overlay content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-2xl px-4">
            <SkeletonBase className="h-12 w-3/4 mx-auto" />
            <SkeletonBase className="h-6 w-full" />
            <SkeletonBase className="h-6 w-2/3 mx-auto" />
          </div>
        </div>
      </div>
      
      {/* Content sections skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Title skeleton */}
        <div className="text-center space-y-4">
          <SkeletonBase className="h-10 w-64 mx-auto" />
          <SkeletonBase className="h-5 w-96 mx-auto" />
        </div>
        
        {/* Gallery grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <SkeletonBase 
              key={i} 
              className="aspect-square"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Portfolio/Gallery page skeleton
export function PortfolioPageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center mb-12 space-y-4">
          <SkeletonBase className="h-8 w-32 mx-auto rounded-full" />
          <SkeletonBase className="h-12 w-72 mx-auto" />
          <SkeletonBase className="h-6 w-96 mx-auto" />
        </div>
        
        {/* Filter bar skeleton */}
        <div className="mb-10 p-4 bg-[var(--bg-secondary)] rounded-2xl">
          <div className="flex flex-wrap gap-3">
            {[...Array(5)].map((_, i) => (
              <SkeletonBase key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
        </div>
        
        {/* Masonry grid skeleton */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {[...Array(12)].map((_, i) => (
            <SkeletonBase 
              key={i} 
              className="break-inside-avoid"
              style={{ 
                height: `${200 + Math.random() * 200}px`,
                animationDelay: `${i * 50}ms`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Posts/Blog page skeleton
export function PostsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center mb-12 space-y-4">
          <SkeletonBase className="h-8 w-40 mx-auto rounded-full" />
          <SkeletonBase className="h-12 w-80 mx-auto" />
          <SkeletonBase className="h-6 w-96 mx-auto" />
        </div>
        
        {/* Featured post skeleton */}
        <div className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <SkeletonBase className="h-64 lg:h-80 rounded-none" />
            <div className="p-8 space-y-4">
              <SkeletonBase className="h-6 w-24 rounded-full" />
              <SkeletonBase className="h-8 w-full" />
              <SkeletonBase className="h-4 w-full" />
              <SkeletonBase className="h-4 w-3/4" />
              <div className="flex gap-4 pt-4">
                <SkeletonBase className="h-4 w-24" />
                <SkeletonBase className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Post grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden">
              <SkeletonBase className="h-48 rounded-none" />
              <div className="p-6 space-y-3">
                <SkeletonBase className="h-6 w-3/4" />
                <SkeletonBase className="h-4 w-full" />
                <SkeletonBase className="h-4 w-2/3" />
                <div className="flex gap-4 pt-2">
                  <SkeletonBase className="h-4 w-20" />
                  <SkeletonBase className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Single post detail skeleton
export function PostDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20 pb-16">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <SkeletonBase className="h-5 w-32 mb-8" />
        
        {/* Post header */}
        <div className="space-y-4 mb-8">
          <SkeletonBase className="h-6 w-24 rounded-full" />
          <SkeletonBase className="h-12 w-full" />
          <SkeletonBase className="h-10 w-4/5" />
          <div className="flex gap-4">
            <SkeletonBase className="h-4 w-28" />
            <SkeletonBase className="h-4 w-20" />
          </div>
        </div>
        
        {/* Featured image */}
        <SkeletonBase className="h-80 w-full mb-8 rounded-2xl" />
        
        {/* Content lines */}
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <SkeletonBase 
              key={i} 
              className="h-4" 
              style={{ width: `${70 + Math.random() * 30}%` }}
            />
          ))}
          <div className="py-4" />
          {[...Array(6)].map((_, i) => (
            <SkeletonBase 
              key={i} 
              className="h-4" 
              style={{ width: `${60 + Math.random() * 40}%` }}
            />
          ))}
        </div>
      </article>
    </div>
  );
}

// Commissions page skeleton
export function CommissionsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center mb-16 space-y-4">
          <SkeletonBase className="h-8 w-48 mx-auto rounded-full" />
          <SkeletonBase className="h-12 w-64 mx-auto" />
          <SkeletonBase className="h-6 w-80 mx-auto" />
        </div>
        
        {/* Services section */}
        <div className="mb-20">
          <SkeletonBase className="h-8 w-40 mx-auto mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[var(--bg-secondary)] rounded-2xl p-6 text-center space-y-4">
                <SkeletonBase className="h-14 w-14 mx-auto rounded-2xl" />
                <SkeletonBase className="h-6 w-32 mx-auto" />
                <SkeletonBase className="h-4 w-full" />
                <SkeletonBase className="h-4 w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Pricing section */}
        <div className="mb-20">
          <SkeletonBase className="h-8 w-32 mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[var(--bg-secondary)] rounded-2xl p-8 space-y-4">
                <SkeletonBase className="h-6 w-24" />
                <SkeletonBase className="h-10 w-20" />
                <SkeletonBase className="h-4 w-full" />
                <div className="space-y-2 pt-4">
                  {[...Array(4)].map((_, j) => (
                    <SkeletonBase key={j} className="h-4 w-full" />
                  ))}
                </div>
                <SkeletonBase className="h-12 w-full rounded-xl mt-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin dashboard skeleton
export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <SkeletonBase className="h-9 w-48" />
          <SkeletonBase className="h-5 w-64" />
        </div>
        <div className="flex gap-3">
          <SkeletonBase className="h-10 w-32 rounded-xl" />
          <SkeletonBase className="h-10 w-28 rounded-xl" />
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[var(--bg-secondary)] rounded-2xl p-6 space-y-3">
            <div className="flex justify-between items-start">
              <SkeletonBase className="h-10 w-10 rounded-xl" />
              <SkeletonBase className="h-6 w-16 rounded-full" />
            </div>
            <SkeletonBase className="h-8 w-16" />
            <SkeletonBase className="h-4 w-24" />
          </div>
        ))}
      </div>
      
      {/* Table skeleton */}
      <div className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[var(--border-color)]">
          <SkeletonBase className="h-6 w-48" />
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <SkeletonBase className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <SkeletonBase className="h-5 w-48" />
                <SkeletonBase className="h-4 w-32" />
              </div>
              <SkeletonBase className="h-8 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Admin messages skeleton
export function AdminMessagesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonBase className="h-8 w-32" />
          <SkeletonBase className="h-5 w-56" />
        </div>
        <SkeletonBase className="h-10 w-36 rounded-full" />
      </div>
      
      {/* Messages list */}
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-[var(--bg-secondary)] rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <SkeletonBase className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <SkeletonBase className="h-5 w-32" />
                  <SkeletonBase className="h-4 w-48" />
                </div>
              </div>
              <SkeletonBase className="h-6 w-16 rounded-full" />
            </div>
            <SkeletonBase className="h-4 w-full" />
            <SkeletonBase className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Admin staff skeleton
export function AdminStaffSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <SkeletonBase className="h-8 w-8 rounded-lg" />
            <SkeletonBase className="h-9 w-48" />
          </div>
          <SkeletonBase className="h-5 w-72" />
        </div>
        <SkeletonBase className="h-10 w-40 rounded-xl" />
      </div>
      
      {/* Staff grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-[var(--bg-secondary)] rounded-2xl p-6 text-center space-y-4">
            <SkeletonBase className="h-24 w-24 rounded-full mx-auto" />
            <SkeletonBase className="h-6 w-32 mx-auto" />
            <SkeletonBase className="h-4 w-24 mx-auto" />
            <SkeletonBase className="h-4 w-full" />
            <SkeletonBase className="h-4 w-3/4 mx-auto" />
            <div className="flex justify-center gap-2 pt-2">
              <SkeletonBase className="h-8 w-8 rounded-lg" />
              <SkeletonBase className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Generic page skeleton with customizable content
export function GenericPageSkeleton({ 
  withHeader = true,
  contentRows = 6 
}: { 
  withHeader?: boolean;
  contentRows?: number;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {withHeader && (
          <div className="text-center mb-12 space-y-4">
            <SkeletonBase className="h-8 w-32 mx-auto rounded-full" />
            <SkeletonBase className="h-12 w-64 mx-auto" />
            <SkeletonBase className="h-6 w-96 mx-auto" />
          </div>
        )}
        
        <div className="space-y-4">
          {[...Array(contentRows)].map((_, i) => (
            <SkeletonBase 
              key={i} 
              className="h-4" 
              style={{ width: `${60 + Math.random() * 40}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Admin artworks grid skeleton
export function AdminArtworksSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonBase className="h-9 w-48" />
          <SkeletonBase className="h-5 w-72" />
        </div>
        <SkeletonBase className="h-10 w-32 rounded-xl" />
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden">
            <SkeletonBase className="aspect-video rounded-none" />
            <div className="p-4 space-y-2">
              <SkeletonBase className="h-5 w-3/4" />
              <SkeletonBase className="h-4 w-1/2" />
              <div className="flex gap-2 pt-2">
                <SkeletonBase className="h-6 w-16 rounded-full" />
                <SkeletonBase className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Admin posts list skeleton
export function AdminPostsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <SkeletonBase className="h-9 w-36" />
          <SkeletonBase className="h-5 w-56" />
        </div>
        <SkeletonBase className="h-10 w-28 rounded-xl" />
      </div>
      
      {/* Posts list */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-[var(--bg-secondary)] rounded-xl p-4 flex items-start gap-4">
            <SkeletonBase className="h-20 w-32 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonBase className="h-5 w-3/4" />
              <SkeletonBase className="h-4 w-full" />
              <SkeletonBase className="h-4 w-2/3" />
              <div className="flex gap-3 pt-1">
                <SkeletonBase className="h-4 w-20" />
                <SkeletonBase className="h-4 w-24" />
              </div>
            </div>
            <SkeletonBase className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Admin commissions/form skeleton
export function AdminCommissionsSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-6">
        <div className="space-y-2">
          <SkeletonBase className="h-9 w-48" />
          <SkeletonBase className="h-5 w-72" />
        </div>
        <SkeletonBase className="h-10 w-24 rounded-xl" />
      </div>
      
      {/* Form fields */}
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonBase className="h-5 w-32" />
            <SkeletonBase className="h-12 w-full rounded-xl" />
          </div>
        ))}
        <div className="space-y-2">
          <SkeletonBase className="h-5 w-40" />
          <SkeletonBase className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
