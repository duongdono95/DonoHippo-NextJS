'use client';
import React, { useEffect } from 'react';
import { FullListingType } from './ProductPageContent';
import ImageSlider from './ImageSlider';
import { MenuItem, TextField } from '@mui/material';
import EditableTextField from './EditableTextField';
import { listingTags } from './ProductCreateNew';

interface Props {
  listing: FullListingType;
  userId: string;
}

const ListingModal = ({ listing, userId }: Props) => {
  const [localListing, setLocalListing] = React.useState(listing);
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalListing({ ...localListing, [e.target.name]: e.target.value });
  };
  return (
    <div className={'flex max-w-7xl max-md:flex-wrap gap-6 p-5 bg-white rounded-2xl'}>
      <div className={'max-w-md w-full min-w-96 max-h-md h-full min-h-96 mx-auto'}>
        <ImageSlider images={listing.images} />
      </div>
      <div className={'flex flex-col min-w-96 max-w-md  w-full gap-5 mx-auto'}>
        <EditableTextField
          fullWidth
          name={'name'}
          label={'Listing Name*'}
          value={localListing.name}
          onChangeFunction={onChange}
        />
        <EditableTextField
          fullWidth
          name={'description'}
          label={'Description*'}
          value={localListing.description}
          onChangeFunction={onChange}
        />
        <EditableTextField
          fullWidth
          name={'price'}
          label={'Price*'}
          value={localListing.price}
          onChangeFunction={onChange}
          type={'number'}
        />
        <TextField
          label={'Tag'}
          fullWidth
          select
          variant={'outlined'}
          value={localListing.tag}
          onChange={e =>
            setLocalListing({
              ...localListing,
              tag: e.target.value as 'Digital Image' | 'Digital Product',
            })
          }
        >
          {listingTags.map(tag => (
            <MenuItem key={tag} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </div>
  );
};

export default ListingModal;
