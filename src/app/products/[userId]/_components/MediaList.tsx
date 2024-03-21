'use client';

import { updateListing } from '@/actions/listing/createListing/updateListing';
import { VisuallyHiddenInput } from '@/components/UploadImage';
import { Button, Modal } from '@mui/material';
import { ImageInterface, ListingInterface } from '@prisma/client';
import { CloudUploadIcon, ContactRound, ImageIcon } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import MediaCard from './MediaCard';
import { ImageInputType } from './ProductCreateNew';
import { imagesCloudinary } from '@/actions/Image/imagesCloudinary';
import { createBulkImages } from '@/actions/Image/createBulkImages';
import deleteImage from '@/actions/Image/deleteImage';
import { useQueryClient } from '@tanstack/react-query';

export interface ModalStateT {
  open: boolean;
  type: 'deleteImage' | 'deleteAttachment' | null;
  image: ImageInterface | null;
  listing: ListingInterface | null;
}

interface Props {
  userId: string;
  userImages: ImageInterface[] | undefined;
  userListings: ListingInterface[] | undefined;
}

const MediaList = ({ userId, userImages, userListings }: Props) => {
  console.log(userImages);
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState<ModalStateT>({
    open: false,
    type: null,
    image: null,
    listing: null,
  });
  if (!userImages) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        Oop...!! It sounds like you have not posted any Photos yet.
      </div>
    );
  }
  const handleUpdateListing = async (image: ImageInterface | null, listing: ListingInterface | null) => {
    if (!image || !listing) return;
    const newImgIds = listing.imgIds.filter(img => img !== image.id);
    const updateResult = await updateListing({
      ...listing,
      imgIds: newImgIds,
    });
    if (updateResult) toast.success('Update Successfully');
    setOpenModal({ image: null, listing: null, open: false, type: null });
  };
  const handleDeleteImage = async (image: ImageInterface | null) => {
    if (!image || !userListings) return;
    const attachedToListings = userListings.filter(listing => listing.imgIds.includes(image.id));
    if (attachedToListings.length > 0) {
      toast.error(`Image is attached to ${attachedToListings.length} listing(s). Please detach first.`);
      return;
    }
    const deleteImageResult = await deleteImage(image);
    if (deleteImageResult) {
      toast.success('Image deleted successfully');
      setOpenModal({ image: null, listing: null, open: false, type: null });
      queryClient.invalidateQueries({ queryKey: ['images'] });
    }
  };

  const handleOnAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const maxImagesUpload: number = 10;
    const maxSizeInMB: number = 10;
    const maxSizeInBytes: number = maxSizeInMB * 1024 * 1024;
    const filesArray: File[] = Array.from(e.target.files).slice(0, maxImagesUpload);
    const validatedFiles: ImageInputType[] = [];
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
      const allImgNames = userImages.map(image => image.name);
      if (allImgNames.includes(fileUrl.name)) {
        toast.error(`File ${fileUrl.name} already exists in your media library, please select a new file!`);
        return;
      }
      validatedFiles.push(fileUrl);
    }
    const pushToCloudResult = await imagesCloudinary(validatedFiles, userId);
    if (pushToCloudResult.length === 0) return toast.error('Error uploading images.');
    const pushToDBResult = await createBulkImages(pushToCloudResult);
    if (pushToDBResult.length === 0) return toast.error('Error uploading images.');
    toast.success('Uploading images successfully.');
    setOpenModal({ open: false, type: null, listing: null, image: null });
    queryClient.invalidateQueries({ queryKey: ['images'] });
  };

  // ----------------------------------------------------------------
  const ModalContent = (openModal: ModalStateT) => {
    return (
      <div>
        {openModal.image && openModal.listing && openModal.open && openModal.type === 'deleteAttachment' && (
          <div className='bg-white rounded-lg'>
            <h3 className='p-4' style={{ backgroundColor: 'var(--primary01)' }}>
              Detach Image
            </h3>
            <p className='px-4 py-6' style={{ borderBottom: '1px solid var(--primary05)' }}>
              Are you sure you want to detach image - <ImageIcon size={16} /> <b>{openModal.image.name}</b> from -{' '}
              <ContactRound size={16} />
              <b>{openModal.listing.name}</b>?
            </p>
            <div className='flex items-center justify-between p-4'>
              <Button
                variant='text'
                color='secondary'
                onClick={() => handleUpdateListing(openModal.image, openModal.listing)}
              >
                Detach
              </Button>
              <Button
                variant='contained'
                color='secondary'
                onClick={() => setOpenModal({ open: false, image: null, listing: null, type: null })}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        {openModal.image && openModal.open && openModal.type === 'deleteImage' && (
          <div className='bg-white rounded-lg'>
            <h3 className='p-4' style={{ backgroundColor: 'var(--primary01)' }}>
              Delete Image
            </h3>
            <p className='px-4 pt-6'>
              Are you sure you want to Delete image - <ImageIcon size={16} /> <b>{openModal.image.name}</b> ?
            </p>
            <p
              className='px-4 pt-4 pb-6 text-red-400 font-normal'
              style={{ borderBottom: '1px solid var(--primary05)' }}
            >
              This item will be deleted immediately. You can't undo this action.
            </p>
            <div className='flex items-center justify-between p-4'>
              <Button variant='text' color='secondary' onClick={() => handleDeleteImage(openModal.image)}>
                Delete
              </Button>
              <Button
                variant='contained'
                color='secondary'
                onClick={() => setOpenModal({ open: false, image: null, listing: null, type: null })}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };
  // ----------------------------------------------------------------

  return (
    userListings && (
      <div className='p-4 flex items-center gap-8 flex-wrap'>
        <Modal
          open={openModal.open}
          onClose={() => setOpenModal({ open: false, type: null, listing: null, image: null })}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {ModalContent(openModal)}
        </Modal>

        <Button
          style={{ width: '160px', height: '240px' }}
          component='label'
          role={undefined}
          variant='outlined'
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput type='file' onChange={handleOnAddImage} accept='image/*,.png,.jpg,.jpeg' />
        </Button>
        {userImages.map(image => {
          const attachedToListings = userListings.filter(listing => listing.imgIds.includes(image.id));
          return <MediaCard image={image} setOpenModal={setOpenModal} attachedToListings={attachedToListings} />;
        })}
      </div>
    )
  );
};

export default MediaList;
