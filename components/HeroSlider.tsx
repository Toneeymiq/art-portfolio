'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Image from 'next/image';
import { Artwork } from '../types/artwork';

interface HeroSliderProps {
  artworks: Artwork[];
}

export default function HeroSlider({ artworks }: HeroSliderProps) {
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
        {artworks.slice(0, 6).map((artwork) => (
          <SwiperSlide key={artwork.id}>
            <div className="relative w-full h-full">
              <Image
                src={artwork.cdnUrl || artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
              <div className="absolute bottom-0 left-0 right-0 text-white p-8 md:p-12">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">{artwork.title}</h2>
                  <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-6">{artwork.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {artwork.tags.map((tag) => (
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