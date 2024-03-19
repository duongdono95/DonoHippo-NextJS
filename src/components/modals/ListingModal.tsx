'use client';
import React from 'react';
import ImageSlider from '../ImageSlider';
import { Button, MenuItem, TextField } from '@mui/material';
import EditableTextField from '../../app/products/[userId]/_components/EditableTextField';
import {
  ImageFileInterface,
  ProductFileInterface,
  listingTags,
} from '../../app/products/[userId]/_components/ProductCreateNew';
import UploadImage from '../UploadImage';
import UploadProduct from '../UploadProduct';
import { ZodIssue } from 'zod';
import { updateListing } from '@/actions/listing/createListing/updateListing';
import { uploadImagesToCloud } from '@/actions/Image/uploadImageToCould';
import { uploadFilesToCloud } from '@/actions/File/uploadFileToCould';
import { toast } from 'react-toastify';
import { FullListingType } from '@/actions/listing/createListing/schema';

interface Props {
  listing: FullListingType;
  userId: string;
}

const ListingModal = ({ listing, userId }: Props) => {
  const [localListing, setLocalListing] = React.useState(listing);
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalListing({ ...localListing, [e.target.name]: e.target.value });
  };
  const [errors, setErrors] = React.useState<ZodIssue[]>([]);

  const convertedImgs: ImageFileInterface[] = localListing.images.map(img => ({
    userId: img.userId,
    file: null,
    fileUrl: img.imageUrl,
    name: img.name,
  }));
  const convertedFiles: ProductFileInterface[] = localListing.files.map(file => ({
    userId: file.userId,
    file: null,
    fileUrl: file.fileUrl,
    name: file.name,
  }));

  const [imgFiles, setImgFiles] = React.useState<ImageFileInterface[]>(convertedImgs);
  const [productFiles, setProductFiles] = React.useState<ProductFileInterface[]>(convertedFiles);

  const submitForm = async () => {
    const newPhotos = imgFiles.filter(item => item.file !== null);
    const uploadNewImagesResult = await uploadImagesToCloud(newPhotos, localListing.userId);
    if (newPhotos.length > 0 && !uploadNewImagesResult) return toast.error('Upload images failed');

    const newFiles = productFiles.filter(item => item.file !== null);
    const uploadNewFileResult = await uploadFilesToCloud(productFiles, localListing.userId);
    if (newFiles.length > 0 && !uploadNewFileResult) return toast.error('Upload files failed');

    updateListing(localListing, uploadNewImagesResult, uploadNewFileResult);
  };
  return (
    <div className='max-w-[90vw] max-h-[90vh] bg-white rounded-2xl overflow-hidden'>
      <h1 className='text-center p-4 bg-slate-100' style={{ borderBottom: '1px solid var(--primary)' }}>
        Listing Detail
      </h1>
      <div className={'flex items-center max-w-7xl max-lg:flex-wrap gap-6 p-5  overflow-y-scroll max-h-[90vh] '}>
        <div className={'max-w-md w-full min-w-96 max-h-md h-full min-h-96 mx-auto'}>
          <ImageSlider images={listing.images} />
        </div>
        <div className={'flex flex-col min-w-96 max-w-md py-5 w-full gap-5 mx-auto'}>
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
            size='small'
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
          <UploadImage
            userId={userId}
            errors={errors}
            setErrors={setErrors}
            imgFiles={imgFiles}
            setImgFiles={setImgFiles}
          />
          <UploadProduct
            userId={userId}
            errors={errors}
            setErrors={setErrors}
            productFiles={productFiles}
            setProductFiles={setProductFiles}
          />
        </div>
      </div>
      <div className='m-4'>
        <Button variant='contained' fullWidth onClick={submitForm}>
          Submit Change
        </Button>
      </div>
    </div>
  );
};

export default ListingModal;
