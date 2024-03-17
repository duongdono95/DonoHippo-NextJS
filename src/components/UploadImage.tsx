import React, { useState } from 'react';
import { Button, IconButton, MenuItem, TextField } from '@mui/material';
import Image from 'next/image';
import { Check, Trash } from 'lucide-react';
import { toast } from 'react-toastify';
import { ProductInterface } from '@/actions/product/createListing/schema';
import { ImageFileInterface } from '@/app/products/[userId]/_components/ProductCreateNew';
import { ZodIssue } from 'zod';

interface Props {
  userId: string;
  errors: ZodIssue[];
  setErrors: React.Dispatch<React.SetStateAction<ZodIssue[]>>;
  imgFiles: ImageFileInterface[];
  setImgFiles: React.Dispatch<React.SetStateAction<ImageFileInterface[]>>;
}
const UploadImage = ({ userId, errors, setErrors, imgFiles, setImgFiles }: Props) => {
  const maxImagesUpload: number = 10;
  const maxSizeInMB: number = 10;
  const maxSizeInBytes: number = maxSizeInMB * 1024 * 1024;
  const handleOnAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray: File[] = Array.from(e.target.files).slice(0, maxImagesUpload);
    for (const file of filesArray) {
      if (file.size > maxSizeInBytes) {
        toast.error(`File ${file.name} is too large. Max size is ${maxSizeInMB}MB.`);
        continue;
      }
      const fileUrl: ImageFileInterface = {
        userId: userId,
        name: file.name,
        file: file,
      };
      setImgFiles(prev => [...prev, fileUrl]);
    }
  };

  return (
    <div className='p-4 bg-slate-50 rounded-md'>
      <div className={'flex justify-between items-center'}>
        <div>
          {imgFiles.length > 0 && (
            <div className={'truncate max-w-52 flex items-center gap-2'}>
              <div className='w-5 h-5'>
                <Check size={20} className={'text-green-500'} />
              </div>
              <p className={'font-medium truncate'}>{imgFiles[imgFiles.length - 1].name}</p>
            </div>
          )}
        </div>
        <label>
          <Button variant='outlined' component='span'>
            Upload Images
            <input
              hidden
              type='file'
              multiple
              onChange={handleOnAddImage}
              accept='image/*,.png,.jpg,.jpeg'
              style={{ display: 'none' }}
            />
          </Button>
        </label>
      </div>
      <TextField
        label={`${imgFiles.length} Uploaded Thumbnail Photo(s)`}
        select
        fullWidth
        sx={{ marginTop: '12px' }}
        error={errors.find(err => err.path[0] === 'name') ? true : false}
        helperText={errors.find(err => err.path[0] === 'name')?.message}
        onClick={() => setErrors(prev => prev.filter(err => err.path[0] !== 'name'))}
      >
        {imgFiles.map((image, index) => (
          <MenuItem key={index}>
            <div className={'flex gap-4 hover:bg-slate-200 rounded-lg   p-2  w-full'}>
              <div className={'relative w-20 h-20  rounded-lg overflow-hidden'}>
                <Image src={URL.createObjectURL(image.file)} alt={image.name} fill />
              </div>
              <div className={'flex-grow flex justify-between items-center'}>
                <p className={'flex-grow truncate max-w-40'}>{image.name}</p>
                <IconButton
                  onClick={e => {
                    e.stopPropagation();
                    setImgFiles(prev => prev.filter(img => img.name !== image.name));
                  }}
                >
                  <Trash size={20} />
                </IconButton>
              </div>
            </div>
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default UploadImage;
