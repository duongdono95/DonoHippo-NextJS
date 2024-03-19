'use client';
import ImageSlider from '@/components/ImageSlider';
import React, { useState } from 'react';
import { Modal, Tooltip } from '@mui/material';
import { formatPrice } from '@/hooks/utils';
import ListingModal from '../../../../components/modals/ListingModal';
import { FullListingType } from '@/actions/listing/createListing/schema';

interface Props {
  userId: string;
  products: FullListingType[];
}

const ProductList = ({ userId, products }: Props) => {
  const [open, setOpen] = useState<{
    open: boolean;
    listing: FullListingType | null;
  }>({
    open: false,
    listing: null,
  });
  return (
    <div className=' w-full h-full'>
      <h3 className='text-center p-4 opacity-70'>Your Inventory</h3>
      <div className='flex gap-4 p-4 align-middle flex-wrap'>
        {products.map(product => (
          <div
            key={product.id}
            className='bg-gray-100 p-4 w-1/4 rounded-md shadow-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all'
            onClick={() =>
              setOpen({
                open: true,
                listing: product,
              })
            }
          >
            <div className='max-w-sm'>
              <ImageSlider images={product.images} />
            </div>
            <h3 className='text-xl py-2 opacity-70'>{product.name}</h3>
            <Tooltip placement='right-start' title={product.description}>
              <p className='opacity-70 truncate'>{product.description}</p>
            </Tooltip>
            <p className='py-2 text-red-400 font-medium'>{formatPrice(product.price)}</p>
          </div>
        ))}
      </div>

      <Modal
        open={open.open}
        onClose={() => {
          setOpen({
            open: false,
            listing: null,
          });
        }}
        aria-labelledby='Listing Detail - Modal'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {open.listing ? (
          <ListingModal listing={open.listing} userId={userId} />
        ) : (
          <p className={'p-4 bg-white text-center font-medium rounded-md text-base'}>
            Sorry, Listing was not found, please try again later.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default ProductList;
