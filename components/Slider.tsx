'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';
import { Artwork } from '../types/artwork';

interface SliderProps {
  artworks: Artwork[];
}

export default function Slider({ artworks }: SliderProps) {
  return (
    <div className="w-full mb-8">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-96"
      >
        {artworks.slice(0, 5).map((artwork) => (
          <SwiperSlide key={artwork.id}>
            <div className="relative w-full h-full">
              <Image
                src={artwork.cdnUrl || artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                <h3 className="text-xl font-bold">{artwork.title}</h3>
                <p>{artwork.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}