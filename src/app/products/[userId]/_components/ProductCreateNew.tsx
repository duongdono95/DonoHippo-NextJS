'use client';
import React, { useState } from 'react';
import { Button, MenuItem, TextField } from '@mui/material';

import UploadImage from '@/components/UploadImage';

import { Loader2 } from 'lucide-react';
import { ZodIssue } from 'zod';

import UploadProduct from '@/components/UploadProduct';
import { ProductInterface, productSchema } from '@/actions/listing/createListing/schema';
import { imagesCloudinary } from '@/actions/Image/imagesCloudinary';
import { createBulkImages } from '@/actions/Image/createBulkImages';
import { toast } from 'react-toastify';
import { filesCloudinary } from '@/actions/File/filesCloudinary';
import { createBulkFiles } from '@/actions/File/createBulkFiles';
import { createListing } from '@/actions/listing/createListing/createListing';

interface Props {
  userId: string;
}
export type ImageInputType = {
  userId: string;
  name: string;
  file: File | null;
  fileUrl?: string;
};
export type ProductInputType = {
  userId: string;
  name: string;
  file: File | null;
  fileUrl?: string;
};
export const listingTags: ('Digital Image' | 'Digital Product')[] = ['Digital Image', 'Digital Product'];

const ProductCreateNew = ({ userId }: Props) => {
  const emptyForm: ProductInterface = {
    userId: userId,
    name: '',
    description: '',
    tag: 'Digital Image',
    price: 0,
  };
  const [form, setForm] = React.useState<ProductInterface>(emptyForm);
  const [errors, setErrors] = useState<ZodIssue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imgFiles, setImgFiles] = useState<ImageInputType[]>([]);
  const [productFiles, setProductFiles] = useState<ProductInputType[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validateForm = productSchema.safeParse(form);
    if (!validateForm.success) {
      setErrors(validateForm.error.errors);
      return;
    }
    if (imgFiles.length === 0 || productFiles.length === 0)
      return toast.error('Please select at least one image and one product file.');
    setIsLoading(true);
    const pushImagesToCloudResults = await imagesCloudinary(imgFiles, userId);
    const createImagesInDB = await createBulkImages(pushImagesToCloudResults);
    if (createImagesInDB.length === 0) return toast.error('Create New Images failed, please try again.');
    const pushProductToCloudResults = await filesCloudinary(productFiles, userId);
    const createFilesInDB = await createBulkFiles(pushProductToCloudResults);
    if (createFilesInDB.length === 0) return toast.error('Create New Files failed, please try again.');

    const createListingResult = await createListing({
      ...form,
      imgIds: createImagesInDB,
      fileIds: createFilesInDB,
    });
    if (!createListingResult) {
      toast.error('Create Listing Failed, please try again.');
    }
    if (createListingResult) {
      toast.success('Create Listing Success');
      setForm(emptyForm);
      setImgFiles([]);
      setProductFiles([]);
    }
    setIsLoading(false);
  };
  return (
    <form className={'flex flex-col gap-4 px-8 max-w-md mx-auto'} onSubmit={handleSubmit}>
      <h3 className={'text-center p-4'}>Create New Listing</h3>
      <TextField
        name='name'
        label={'Name'}
        fullWidth
        variant={'outlined'}
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        error={errors.find(err => err.path[0] === 'name') ? true : false}
        helperText={errors.find(err => err.path[0] === 'name')?.message}
        onClick={() => setErrors(prev => prev.filter(err => err.path[0] !== 'name'))}
      />
      <TextField
        name='description'
        label={'Description'}
        fullWidth
        variant={'outlined'}
        value={form.description}
        onChange={e =>
          setForm({
            ...form,
            description: e.target.value,
          })
        }
        error={errors.find(err => err.path[0] === 'description') ? true : false}
        helperText={errors.find(err => err.path[0] === 'description')?.message}
        onClick={() => setErrors(prev => prev.filter(err => err.path[0] !== 'description'))}
      />
      <TextField
        label={'Tag'}
        fullWidth
        select
        variant={'outlined'}
        value={form.tag}
        onChange={e =>
          setForm({
            ...form,
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
      <TextField
        label={'Price'}
        type={'number'}
        fullWidth
        variant={'outlined'}
        value={form.price}
        onChange={e =>
          setForm({
            ...form,
            price: Number(e.target.value),
          })
        }
      />
      <UploadImage
        userId={form.userId}
        errors={errors}
        setErrors={setErrors}
        imgFiles={imgFiles}
        setImgFiles={setImgFiles}
      />
      <UploadProduct
        userId={form.userId}
        errors={errors}
        setErrors={setErrors}
        productFiles={productFiles}
        setProductFiles={setProductFiles}
      />
      <Button type='submit' fullWidth variant='contained' sx={{ marginTop: '16px' }}>
        {isLoading && <Loader2 className='animated-rotation' style={{ marginRight: '5px' }} />}Create a new Listing
      </Button>
    </form>
  );
};

export default ProductCreateNew;
