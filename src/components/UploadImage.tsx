import React, { useState } from 'react';
import { Button, Dialog, IconButton, MenuItem, Modal, TextField, styled } from '@mui/material';
import Image from 'next/image';
import { Check, CloudUploadIcon, Trash } from 'lucide-react';
import { toast } from 'react-toastify';
import { ImageFileInterface } from '@/app/products/[userId]/_components/ProductCreateNew';
import { ZodIssue } from 'zod';
import MediaModal from './modals/MediaModal';

export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface Props {
  userId: string;
  errors: ZodIssue[];
  setErrors: React.Dispatch<React.SetStateAction<ZodIssue[]>>;
  imgFiles: ImageFileInterface[];
  setImgFiles: React.Dispatch<React.SetStateAction<ImageFileInterface[]>>;
}
const UploadImage = ({ userId, errors, setErrors, imgFiles, setImgFiles }: Props) => {
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
      <Dialog open={openMedia} onClose={() => setOpenMedia(false)}>
        <MediaModal userId={userId} imgFiles={imgFiles} setImgFiles={setImgFiles} />
      </Dialog>
      <div className={'flex flex-col '}>
        <div className='flex justify-between items-center'>
          <Button onClick={() => setOpenMedia(true)} variant='text'>
            Add from Media
          </Button>
          <Button component='label' role={undefined} variant='outlined' tabIndex={-1} startIcon={<CloudUploadIcon />}>
            Upload file
            <VisuallyHiddenInput type='file' onChange={handleOnAddImage} accept='image/*,.png,.jpg,.jpeg' />
          </Button>
        </div>
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
                <Image
                  src={image.fileUrl ?? (image.file ? URL.createObjectURL(image.file) : '')}
                  alt={image.name}
                  fill
                />
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
