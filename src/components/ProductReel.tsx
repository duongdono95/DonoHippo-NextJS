'use client';

import { ImageInterface, ListingInterface } from '@prisma/client';
import MaxWidthWrapper from './MaxWidthWrapper';
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductCard from './ProductCard';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';
interface Props {
  listings: ListingInterface[];
  allImages: ImageInterface[];
}

const ProductReel = ({ listings, allImages }: Props) => {
  return (
    <MaxWidthWrapper>
      <h1 className='px-4 py-2' style={{ borderBottom: '1px solid var(--primary03)' }}>
        Highlighted Products
      </h1>
      <div className='flex w-full items-center gap-8 py-6 px-4'>
        <Swiper
          slidesPerView={5}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Pagination, Navigation]}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            450: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 50,
            },
          }}
          loop={true}
          navigation={true}
          className='mySwiper'
        >
          {listings.map(listing => {
            const imgs = allImages.filter(img => listing.imgIds.includes(img.id));
            return (
              <SwiperSlide style={{ display: 'flex', justifyContent: 'center', padding: '20px' }} key={listing.id}>
                <ProductCard listing={listing} images={imgs} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </MaxWidthWrapper>
  );
};

export default ProductReel;
