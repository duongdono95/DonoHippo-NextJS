import { db } from '@/libs/db';
import { ListingInterface } from '@prisma/client';
import React from 'react';
import ImageSlider from './ImageSlider';
import { Tooltip } from '@mui/material';
import { formatPrice } from '@/hooks/utils';

interface Props {
  listing: ListingInterface;
}

const ProductCard = async ({ listing }: Props) => {
  const images = await db.imageInterface.findMany({
    where: {
      id: {
        in: listing.imgIds,
      },
    },
  });

  return (
    <div className='p-2 bg-zinc-100 rounded-lg'>
      <div className='w-40 h-40'>
        <ImageSlider images={images} />
      </div>
      <Tooltip placement='right' title={listing.name}>
        <p className='truncate font-medium text-base px-2 pt-4 w-40'>{listing.name}</p>
      </Tooltip>
      <Tooltip placement='right' title={listing.description}>
        <p className='w-40 p-2 truncate opacity-70'>{listing.description}</p>
      </Tooltip>
      <div className='px-2 mb-2'>
        {listing.price === 0 ? (
          <p className='px-2 py-1 bg-green-500 text-white w-12 text-center font-semibold opacity-90 rounded-md'>Free</p>
        ) : (
          formatPrice(listing.price)
        )}
      </div>
    </div>
  );
};

export default ProductCard;
