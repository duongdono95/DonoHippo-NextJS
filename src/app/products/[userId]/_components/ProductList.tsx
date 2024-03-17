import ImageSlider from '@/app/products/[userId]/_components/ImageSlider';
import { Image as ImageType, Listing } from '@prisma/client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Tooltip } from '@mui/material';
import { formatPrice } from '@/hooks/utils';

interface Props {
  userId: string;
  products: ({
    images: ImageType[];
  } & Listing)[];
}

const ProductList = ({ userId, products }: Props) => {
  return (
    <div className=' w-full h-full'>
      <h3 className='text-center p-4 opacity-70'>Your Inventory</h3>
      <div className='flex gap-4 p-4 align-middle flex-wrap'>
        {products.map(product => (
          <div key={product.id} className='bg-gray-100 p-4 w-1/4 rounded-md shadow-md'>
            <ImageSlider images={product.images} />
            <h3 className='text-xl py-2 opacity-70'>{product.name}</h3>
            <Tooltip placement='right-start' title={product.description}>
              <p className='opacity-70 truncate'>{product.description}</p>
            </Tooltip>
            <p className='py-2 text-red-400 font-medium'>{formatPrice(product.price)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
