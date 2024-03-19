import React, { useState } from 'react';
import { Button, Dialog, IconButton, MenuItem, Modal, TextField, styled } from '@mui/material';
import Image from 'next/image';
import { Check, Trash, CloudUploadIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { ZodIssue } from 'zod';
import { ProductFileInterface } from '@/app/products/[userId]/_components/ProductCreateNew';
import { VisuallyHiddenInput } from './UploadImage';
import FileModal from './modals/FileModal';

interface Props {
  userId: string;
  errors: ZodIssue[];
  setErrors: React.Dispatch<React.SetStateAction<ZodIssue[]>>;
  productFiles: ProductFileInterface[];
  setProductFiles: React.Dispatch<React.SetStateAction<ProductFileInterface[]>>;
}
const UploadProduct = ({ userId, errors, setErrors, productFiles, setProductFiles }: Props) => {
  const [openMedia, setOpenMedia] = useState<boolean>(false);
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
      const fileUrl: ProductFileInterface = {
        userId: userId,
        name: file.name,
        file: file,
      };
      setProductFiles(prev => [...prev, fileUrl]);
    }
  };

  return (
    <div className='p-4 bg-slate-50 rounded-md'>
      <Dialog open={openMedia} onClose={() => setOpenMedia(false)}>
        <FileModal userId={userId} productFiles={productFiles} setProductFiles={setProductFiles} />
      </Dialog>
      <div className={'flex flex-col '}>
        <div className='flex justify-between items-center'>
          <Button onClick={() => setOpenMedia(true)} variant='text'>
            Add from Files
          </Button>
          <Button component='label' role={undefined} variant='outlined' tabIndex={-1} startIcon={<CloudUploadIcon />}>
            Upload file
            <VisuallyHiddenInput type='file' onChange={handleOnAddImage} accept='.zip,.rar,.7zip' />
          </Button>
        </div>
      </div>

      <TextField
        label={`${productFiles.length} Uploaded Compressed File(s)`}
        select
        fullWidth
        sx={{ marginTop: '12px' }}
        error={errors.find(err => err.path[0] === 'name') ? true : false}
        helperText={errors.find(err => err.path[0] === 'name')?.message}
        onClick={() => setErrors(prev => prev.filter(err => err.path[0] !== 'name'))}
      >
        {productFiles.map((f, index) => (
          <MenuItem key={index}>
            <div className={'flex gap-4 hover:bg-slate-200 rounded-lg   p-2  w-full'}>
              <div className={'flex-grow flex justify-between items-center'}>
                <p className={'flex-grow truncate max-w-40'}>{f.name}</p>
                <IconButton
                  onClick={e => {
                    e.stopPropagation();
                    setProductFiles(prev => prev.filter(file => file.name !== f.name));
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

export default UploadProduct;
