'use client';
import ImageSlider from '@/components/ImageSlider';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@mui/material';
import { ImageInterface, ListingInterface } from '@prisma/client';
import { ShoppingCartIcon } from 'lucide-react';
import React from 'react';

interface Props {
  images: ImageInterface[];
  listing: ListingInterface;
}

const ProductCard = ({ images, listing }: Props) => {
  const { addItem } = useCart();
  return (
    <div className='w-60'>
      <div className='w-60 h-6w-60'>
        <ImageSlider images={images} />
      </div>
      <h4 className='px-2 pb-2 pt-4 truncate'>{listing.name}</h4>
      <p className='px-2 truncate '>{listing.description}</p>
      <p className='p-2 opacity-70'>{listing.tag}</p>
      <Button
        variant='contained'
        fullWidth
        sx={{ mt: '10px' }}
        onClick={e => {
          e.stopPropagation();
          addItem({
            images: images,
            listing: listing,
          });
        }}
      >
        Add To Cart <ShoppingCartIcon size={16} style={{ marginLeft: '5px' }} />
      </Button>
    </div>
  );
};

export default ProductCard;
