'use client';
import React, { useState } from 'react';
import ImageSlider from '../ImageSlider';
import { Button, MenuItem, Modal, Switch, TextField } from '@mui/material';
import EditableTextField from '../../app/products/[userId]/_components/EditableTextField';
import { ImageInputType, FileInputType, listingTags } from '../../app/products/[userId]/_components/ProductCreateNew';
import UploadImage from '../UploadImage';

import { ImageInterface, ListingInterface, FileInterface } from '@prisma/client';
import UploadProduct from '../UploadProduct';
import { toast } from 'react-toastify';
import { imagesCloudinary } from '@/actions/Image/imagesCloudinary';
import { createBulkImages } from '@/actions/Image/createBulkImages';
import { filesCloudinary } from '@/actions/File/filesCloudinary';
import { createBulkFiles } from '@/actions/File/createBulkFiles';
import { updateListing } from '@/actions/listing/createListing/updateListing';
import { OpenT } from '@/app/products/[userId]/_components/ProductList';
import { useQueryClient } from '@tanstack/react-query';
import { Trash } from 'lucide-react';
import { deleteListing } from '@/actions/listing/createListing/deleteListing';

interface Props {
  listing: ListingInterface;
  userId: string;
  listingImgs: ImageInterface[];
  setListingImgs: React.Dispatch<React.SetStateAction<ImageInterface[]>>;
  listingFiles: FileInterface[];
  setListingFiles: React.Dispatch<React.SetStateAction<FileInterface[]>>;
  setOpen: React.Dispatch<React.SetStateAction<OpenT>>;
}

const ListingModal = ({
  listing,
  userId,
  listingImgs,
  setListingImgs,
  listingFiles,
  setListingFiles,
  setOpen,
}: Props) => {
  const queryClient = useQueryClient();
  const [localListing, setLocalListing] = React.useState(listing);
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalListing({ ...localListing, [e.target.name]: e.target.value });
  };
  const [openModal, setOpenModal] = useState(false);
  const [uploadedImgs, setUploadedImgs] = useState<ImageInputType[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileInputType[]>([]);
  const submitForm = async () => {
    const listingImgIds: string[] = listingImgs.map(img => img.id);
    const listingFilesIds: string[] = listingFiles.map(file => file.id);
    if (uploadedImgs.length === 0 && listingImgs.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    if (uploadedImgs.length > 0) {
      const pushImgsToCloud = await imagesCloudinary(uploadedImgs, userId);
      const pushImgsToDB = await createBulkImages(pushImgsToCloud);
      pushImgsToDB.map(img => listingImgIds.push(img.id));
    }

    if (uploadedFiles.length > 0) {
      const pushFilesToCloud = await filesCloudinary(uploadedFiles, userId);
      const pushFilesToDB = await createBulkFiles(pushFilesToCloud);
      pushFilesToDB.map(file => listingFilesIds.push(file.id));
    }

    const updateResult = await updateListing({
      ...localListing,
      imgIds: listingImgIds,
      fileIds: listingFilesIds,
    });
    if (!updateResult) {
      toast.error('Error updating listing');
      return;
    }
    toast.success('Listing updated successfully');
    queryClient.invalidateQueries({ queryKey: ['listings', 'images', 'files'] });
    setOpen({ open: false, listing: null });
  };
  const handleDeleteListing = async () => {
    console.log('executed');
    const result = await deleteListing(listing.id);
    console.log(result);
    if (result) {
      setOpenModal(false);
      setOpen({ open: false, listing: null });
      toast.success('Listing deleted successfully');
    }
  };
  return (
    <div className='max-w-[90vw] max-h-[90vh] bg-white rounded-2xl overflow-y-scroll'>
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div className='min-w-[30vw] bg-white rounded-lg'>
          <h3 className='p-4' style={{ backgroundColor: 'var(--primary01)' }}>
            Confirm Deletion
          </h3>
          <p className='px-4 py-6' style={{ borderBottom: '1px solid var(--primary02)' }}>
            Are you sure you want to delete {listing.name} listing?{' '}
          </p>
          <div className='flex justify-between px-4 py-2'>
            <Button variant='outlined' onClick={() => handleDeleteListing()}>
              Delete
            </Button>
            <Button variant='contained' onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      <h1 className='text-center p-4 bg-slate-100' style={{ borderBottom: '1px solid var(--primary)' }}>
        Listing Detail
      </h1>
      <div className={'flex flex-1   items-center max-lg:flex-wrap gap-6 p-5  overflow-scroll'}>
        <div className={'max-w-md w-full min-w-96 max-h-md h-full min-h-96 mx-auto'}>
          <ImageSlider images={listingImgs} />
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
            imgFiles={uploadedImgs}
            setImgFiles={setUploadedImgs}
            selectedFromMedia={listingImgs}
            setSelectedFromMedia={setListingImgs}
          />
          <UploadProduct
            userId={userId}
            productFiles={uploadedFiles}
            setProductFiles={setUploadedFiles}
            selectedFromFiles={listingFiles}
            setSelectedFromFiles={setListingFiles}
          />
          <div className='flex justify-between'>
            <div
              className={'flex items-center gap-2 py-3 px-6 rounded-lg'}
              style={{ border: '1px solid var(--primary05)' }}
            >
              <p className={'font-medium '} style={{ color: 'var(--primary)' }}>
                Listing Status
              </p>
              <Switch
                checked={localListing.status === 'active'}
                onChange={() =>
                  setLocalListing(prev => ({ ...prev, status: prev.status === 'active' ? 'inactive' : 'active' }))
                }
              />
            </div>
            <Button variant='outlined' color='error' onClick={() => setOpenModal(true)}>
              <Trash size={20} className='mr-2' />
              Delete Listing
            </Button>
          </div>
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
