'use client';
import ImageSlider from '@/components/ImageSlider';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import ProductReel from '@/components/ProductReel';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/hooks/utils';

import { Button } from '@mui/material';
import { ImageInterface, ListingInterface } from '@prisma/client';
import { Check, Shield, ShoppingCart } from 'lucide-react';
import React from 'react';

interface Props {
  listings: ListingInterface[];
  listing: ListingInterface;
  listingImages: ImageInterface[];
  images: ImageInterface[];
}

const ProductContent = ({ listing, listings, listingImages, images }: Props) => {
  const { addItem } = useCart();
  return (
    <MaxWidthWrapper className=''>
      <div className='flex flex-wrap items-center justify-between py-20'>
        <div className=' w-1/2 min-w-[400px] flex items-center justify-center'>
          <div className='h-96 w-96 '>
            <ImageSlider images={listingImages} />
          </div>
        </div>
        <div className='w-1/2 min-w-[400px] p-5 flex flex-col items-center justify-center'>
          <div className='w-full flex flex-col gap-5'>
            <h1>{listing.name}</h1>
            <p className='text-base'>{listing.description}</p>
            <p className='opacity-70'>{listing.tag}</p>
            <p className='text-lg font-medium' style={{ color: 'var(--primary)' }}>
              {formatPrice(listing.price)}
            </p>
            <div className='flex gap-2 items-center'>
              <Check size={20} className='text-green-500' />
              <p>Eligible for instant delivery</p>
            </div>
            <div className='group inline-flex text-sm text-medium'>
              <Shield aria-hidden='true' className='mr-2 h-5 w-5 flex-shrink-0 text-orange-500' />
              <span className='text-muted-foreground hover:text-gray-700'>30 Day Return Guarantee</span>
            </div>
            <Button
              fullWidth
              variant='contained'
              onClick={() =>
                addItem({
                  listing: listing,
                  images: listingImages,
                })
              }
            >
              Add to Cart <ShoppingCart className='ml-2' />
            </Button>
          </div>
        </div>
      </div>
      <ProductReel allImages={images} listings={listings} />
    </MaxWidthWrapper>
  );
};

export default ProductContent;
