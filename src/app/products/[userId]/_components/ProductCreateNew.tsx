'use client';
import React, { Suspense, useRef, useState } from 'react';
import { Button, MenuItem, TextField } from '@mui/material';
import { File as FileType, Image } from '@prisma/client';
import UploadImage from '@/components/UploadImage';

import { Loader2 } from 'lucide-react';
import { ZodIssue } from 'zod';
import { toast } from 'react-toastify';
import UploadProduct from '@/components/UploadProduct';
import { uploadImagesToCloud } from '@/actions/Image/uploadImageToCould';
import { uploadFilesToCloud } from '@/actions/File/uploadFileToCould';
import { ProductInterface } from '@/actions/listing/createListing/schema';
import { createListing } from '@/actions/listing/createListing/createListing';

interface Props {
  userId: string;
}
export type ImageFileInterface = {
  userId: string;
  name: string;
  file: File;
};
export type ProductFileInterface = {
  userId: string;
  name: string;
  file: FileType;
};
export const listingTags: ('Digital Image' | 'Digital Product')[] = ['Digital Image', 'Digital Product'];

const ProductCreateNew = ({ userId }: Props) => {
  const emptyForm: ProductInterface = {
    userId: userId,
    name: '',
    description: '',
    tag: 'Digital Image',
    price: 0,
    images: [],
    files: [],
  };
  const [form, setForm] = React.useState<ProductInterface>(emptyForm);
  const [errors, setErrors] = useState<ZodIssue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imgFiles, setImgFiles] = useState<ImageFileInterface[]>([]);
  const [productFiles, setProductFiles] = useState<ProductFileInterface[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (imgFiles.length === 0 || productFiles.length === 0) return;
    const uploadImagesResult = await uploadImagesToCloud(imgFiles, form);
    if (!uploadImagesResult || uploadImagesResult.length === 0) {
      toast.error('Error uploading Images');
      return setIsLoading(false);
    }

    const uploadFileResult = await uploadFilesToCloud(productFiles, form);
    if (!uploadFileResult || uploadFileResult.length === 0) {
      toast.error('Error uploading files');
      return setIsLoading(false);
    }

    const newForm: ProductInterface = {
      ...form,
      images: uploadImagesResult,
      files: uploadFileResult,
    };
    const result = await createListing(newForm);
    if (result.zodError) {
      setErrors(result.zodError);
      return { code: 300 };
    }
    if (result.data) {
      toast.success('Listing created successfully');
      setIsLoading(false);
      setForm(emptyForm);
    }
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
