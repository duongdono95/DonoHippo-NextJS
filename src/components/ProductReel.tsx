import { ListingInterface } from '@prisma/client';
import MaxWidthWrapper from './MaxWidthWrapper';
import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductCard from './ProductCard';
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';
interface Props {
  listings: ListingInterface[];
}

const ProductReel = ({ listings }: Props) => {
  return (
    <MaxWidthWrapper>
      <h1 className='px-4 py-2' style={{ borderBottom: '1px solid var(--primary03)' }}>
        Highlighted Products
      </h1>
      <div className='flex w-full items-center gap-8 py-6 px-4'>
        {listings.map(listing => (
          <ProductCard key={listing.id} listing={listing} />
        ))}
      </div>
    </MaxWidthWrapper>
  );
};

export default ProductReel;
