'use client';
import ImageSlider from '@/components/ImageSlider';
import React, { useState } from 'react';
import { Button, Modal, Tooltip } from '@mui/material';
import { formatPrice } from '@/hooks/utils';
import ListingModal from '../../../../components/modals/ListingModal';
import { FileInterface, ImageInterface, ListingInterface } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/hooks/fetcher';
import { productPageStore } from './store-product-page';
import { ImageInputType, FileInputType } from './ProductCreateNew';
import { BadgeDollarSign } from 'lucide-react';

interface Props {
  userId: string;
  userListings: ListingInterface[] | undefined;
  userFiles: FileInterface[] | undefined;
  userImages: ImageInterface[] | undefined;
}
export interface OpenT {
  open: boolean;
  listing: ListingInterface | null;
}

const ProductList = ({ userId, userListings, userFiles, userImages }: Props) => {
  const { setActive } = productPageStore();

  const [open, setOpen] = useState<OpenT>({
    open: false,
    listing: null,
  });
  const [listingImgs, setListingImgs] = useState<ImageInterface[]>([]);

  const [listingFiles, setListingFiles] = useState<FileInterface[]>([]);

  if (!userListings || !userImages || !userFiles || userListings.length === 0) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <p>
          No Listing was found, lets{' '}
          <Button variant={'text'} onClick={() => setActive('Create New')}>
            create a new Listing
          </Button>
          !
        </p>
      </div>
    );
  }
  return (
    <div className=' w-full h-full'>
      <h3 className='text-center p-4 opacity-70'>Your Inventory</h3>

      <div className=' flex gap-8 p-4 align-middle flex-wrap'>
        {userListings.map(listing => {
          const listingImgs = userImages.filter(img => listing.imgIds.includes(img.id));
          const listingFiles = userFiles.filter(file => listing.fileIds.includes(file.id));
          return (
            <div
              key={listing.id}
              className='bg-gray-100 relative min-w-52 p-4 w-1/4 rounded-md shadow-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all'
              onClick={() => {
                setOpen({
                  open: true,
                  listing: listing,
                });
                setListingImgs(listingImgs);
                setListingFiles(listingFiles);
              }}
            >
              {listing.status === 'active' ? (
                <div
                  className='absolute -top-4 -right-4 w-8 h-8 flex items-center justify-center rounded-full shadow-lg'
                  style={{ backdropFilter: 'blur(10px)', backgroundColor: 'var(--primary05)' }}
                >
                  <Tooltip title="Item's listed">
                    <BadgeDollarSign color='white' />
                  </Tooltip>
                </div>
              ) : null}
              <div className='max-w-sm'>
                <ImageSlider images={listingImgs} />
              </div>
              <h3 className='text-xl py-2 opacity-70'>{listing.name}</h3>
              <Tooltip placement='right-start' title={listing.description}>
                <p className='opacity-70 truncate'>{listing.description}</p>
              </Tooltip>
              <p className='py-2 text-red-400 font-medium'>{formatPrice(listing.price)}</p>
            </div>
          );
        })}
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
          <ListingModal
            listing={open.listing}
            userId={userId}
            listingImgs={listingImgs}
            setListingImgs={setListingImgs}
            listingFiles={listingFiles}
            setListingFiles={setListingFiles}
            setOpen={setOpen}
          />
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
