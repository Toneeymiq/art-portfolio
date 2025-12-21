'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { Artwork } from '../types/artwork';
import { getImageUrl, hasValidImage } from '@/lib/utils';

interface HeroSliderProps {
  artworks: Artwork[];
}

export default function HeroSlider({ artworks }: HeroSliderProps) {
  // Filter artworks to only those with valid images for the hero slider
  const validArtworks = artworks.filter(a => hasValidImage(a.cdnUrl, a.imageUrl));

  if (validArtworks.length === 0) {
    return null; // Don't render slider if no valid images
  }

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[600px]">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-white/50 !w-3 !h-3',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-white'
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        className="h-full"
      >
        {validArtworks.slice(0, 6).map((artwork) => (
          <SwiperSlide key={artwork.id}>
            <div className="relative w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageUrl(artwork.cdnUrl, artwork.imageUrl, artwork.id)}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
              <div className="absolute bottom-0 left-0 right-0 text-white p-8 md:p-12">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4">{artwork.title}</h2>
                  <p className="text-sm md:text-xl text-white/90 max-w-2xl mb-4 md:mb-6 line-clamp-2 md:line-clamp-none">{artwork.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {artwork.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom pagination styling */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 2rem !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
        }
        .swiper-pagination-bullet {
          margin: 0 4px !important;
        }
      `}</style>
    </div>
  );
}