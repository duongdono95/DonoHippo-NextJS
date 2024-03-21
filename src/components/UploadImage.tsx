import React, { useState } from 'react';
import { Button, Dialog, IconButton, MenuItem, Modal, TextField, styled } from '@mui/material';
import Image from 'next/image';
import { Check, CloudUploadIcon, Trash } from 'lucide-react';
import { toast } from 'react-toastify';
import { ImageInputType } from '@/app/[userId]/create-new/_components/ProductCreateNew';
import { ZodIssue } from 'zod';
import MediaModal from './modals/MediaModal';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/hooks/fetcher';
import { ImageInterface } from '@prisma/client';

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
  imgFiles: ImageInputType[];
  setImgFiles: React.Dispatch<React.SetStateAction<ImageInputType[]>>;
  selectedFromMedia: ImageInterface[];
  setSelectedFromMedia: React.Dispatch<React.SetStateAction<ImageInterface[]>>;
}
const UploadImage = ({ userId, imgFiles, setImgFiles, selectedFromMedia, setSelectedFromMedia }: Props) => {
  const { data: userImages } = useQuery<ImageInterface[]>({
    queryKey: ['images'],
    queryFn: () => fetcher(`/api/media/${userId}`),
  });
  const allImgNames = userImages?.map(img => img.name) ?? [];

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
      const fileUrl: ImageInputType = {
        userId: userId,
        name: file.name,
        file: file,
      };
      if (allImgNames.includes(fileUrl.name)) {
        toast.error(`File ${fileUrl.name} already exists in your media library, please select a new file!`);
        return;
      }
      setImgFiles(prev => [...prev, fileUrl]);
    }
  };

  return (
    <div className='p-4 bg-slate-100 rounded-md'>
      <Dialog open={openMedia} onClose={() => setOpenMedia(false)}>
        <MediaModal
          userId={userId}
          imgFiles={imgFiles}
          setImgFiles={setImgFiles}
          selectedFromMedia={selectedFromMedia}
          setSelectedFromMedia={setSelectedFromMedia}
        />
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
        label={`${imgFiles.length + selectedFromMedia.length} Uploaded Thumbnail Photo(s)`}
        select
        fullWidth
        sx={{ marginTop: '12px' }}
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

        {selectedFromMedia.map((image, index) => (
          <MenuItem key={index}>
            <div className={'flex gap-4 hover:bg-slate-200 rounded-lg   p-2  w-full'}>
              <div className={'relative w-20 h-20  rounded-lg overflow-hidden'}>
                <Image src={image.imageUrl} alt={image.name} fill />
              </div>
              <div className={'flex-grow flex justify-between items-center'}>
                <p className={'flex-grow truncate max-w-40'}>{image.name}</p>
                <IconButton
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedFromMedia(prev => prev.filter(img => img.name !== image.name));
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
