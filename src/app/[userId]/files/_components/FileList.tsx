'use client';

import { createBulkFiles } from '@/actions/File/createBulkFiles';
import { deleteFile } from '@/actions/File/deleteFile';
import { filesCloudinary } from '@/actions/File/filesCloudinary';
import { updateListing } from '@/actions/listing/createListing/updateListing';
import { VisuallyHiddenInput } from '@/components/UploadImage';
import { Button, Modal } from '@mui/material';
import { FileInterface, ListingInterface } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import { CloudUploadIcon, ContactRound, File } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import FileCard from './FileCard';
import { FileInputType } from '../../create-new/_components/ProductCreateNew';

export interface ModalStateT {
  open: boolean;
  type: 'deleteFile' | 'deleteAttachment' | null;
  file: FileInterface | null;
  listing: ListingInterface | null;
}

interface Props {
  userId: string;
  userFiles: FileInterface[] | undefined;
  userListings: ListingInterface[] | undefined;
}

const FileList = ({ userId, userFiles, userListings }: Props) => {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState<ModalStateT>({
    open: false,
    type: null,
    file: null,
    listing: null,
  });
  if (!userFiles) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        Oop...!! It sounds like you have not uploaded any File yet.
      </div>
    );
  }
  const handleUpdateListing = async (file: FileInterface | null, listing: ListingInterface | null) => {
    if (!file || !listing) return;
    const newFileIds = listing.fileIds.filter(f => f !== file.id);
    const updateResult = await updateListing({
      ...listing,
      fileIds: newFileIds,
    });
    if (updateResult) toast.success('Update Successfully');
    setOpenModal({ file: null, listing: null, open: false, type: null });
  };
  const handleDeleteFile = async (file: FileInterface | null) => {
    if (!file || !userListings) return;
    const attachedToListings = userListings.filter(listing => listing.fileIds.includes(file.id));
    if (attachedToListings.length > 0) {
      toast.error(`File is attached to ${attachedToListings.length} listing(s). Please detach first.`);
      return;
    }
    const deleteFileResult = await deleteFile(file);
    if (deleteFileResult) {
      toast.success('File deleted successfully');
      setOpenModal({ file: null, listing: null, open: false, type: null });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    }
  };

  const handleOnAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const maxFilesUpload: number = 10;
    const maxSizeInMB: number = 10;
    const maxSizeInBytes: number = maxSizeInMB * 1024 * 1024;
    const filesArray: File[] = Array.from(e.target.files).slice(0, maxFilesUpload);
    const validatedFiles: FileInputType[] = [];
    for (const file of filesArray) {
      if (file.size > maxSizeInBytes) {
        toast.error(`File ${file.name} is too large. Max size is ${maxSizeInMB}MB.`);
        continue;
      }
      const fileUrl: FileInputType = {
        userId: userId,
        name: file.name,
        file: file,
      };
      const allFileName = userFiles.map(file => file.name);
      if (allFileName.includes(fileUrl.name)) {
        toast.error(`File ${fileUrl.name} already exists in your media library, please select a new file!`);
        return;
      }
      validatedFiles.push(fileUrl);
    }
    const pushToCloudResult = await filesCloudinary(validatedFiles, userId);
    if (pushToCloudResult.length === 0) return toast.error('Error uploading files.');
    const pushToDBResult = await createBulkFiles(pushToCloudResult);
    if (pushToDBResult) return toast.error('Error uploading files.');
    toast.success('Uploading files successfully.');
    queryClient.invalidateQueries({ queryKey: ['files'] });
  };

  // ----------------------------------------------------------------
  const ModalContent = (openModal: ModalStateT) => {
    return (
      <div>
        {openModal.file && openModal.listing && openModal.open && openModal.type === 'deleteAttachment' && (
          <div className='bg-white rounded-lg'>
            <h3 className='p-4' style={{ backgroundColor: 'var(--primary01)' }}>
              Detach File
            </h3>
            <p className='px-4 py-6' style={{ borderBottom: '1px solid var(--primary05)' }}>
              Are you sure you want to detach File - <File size={16} /> <b>{openModal.file.name}</b> from -{' '}
              <ContactRound size={16} />
              <b>{openModal.listing.name}</b>?
            </p>
            <div className='flex items-center justify-between p-4'>
              <Button
                variant='text'
                color='secondary'
                onClick={() => handleUpdateListing(openModal.file, openModal.listing)}
              >
                Detach
              </Button>
              <Button
                variant='contained'
                color='secondary'
                onClick={() => setOpenModal({ open: false, file: null, listing: null, type: null })}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        {openModal.file && openModal.open && openModal.type === 'deleteFile' && (
          <div className='bg-white rounded-lg'>
            <h3 className='p-4' style={{ backgroundColor: 'var(--primary01)' }}>
              Delete File
            </h3>
            <p className='px-4 pt-6'>
              Are you sure you want to Delete File - <File size={16} /> <b>{openModal.file.name}</b> ?
            </p>
            <p
              className='px-4 pt-4 pb-6 text-red-400 font-normal'
              style={{ borderBottom: '1px solid var(--primary05)' }}
            >
              This item will be deleted immediately. You can NOT undo this action.
            </p>
            <div className='flex items-center justify-between p-4'>
              <Button variant='text' color='secondary' onClick={() => handleDeleteFile(openModal.file)}>
                Delete
              </Button>
              <Button
                variant='contained'
                color='secondary'
                onClick={() => setOpenModal({ open: false, file: null, listing: null, type: null })}
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
      <div className='p-4 flex items-center justify-center gap-8 flex-wrap'>
        <Modal
          open={openModal.open}
          onClose={() => setOpenModal({ open: false, type: null, listing: null, file: null })}
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
          <VisuallyHiddenInput type='file' onChange={handleOnAddFile} accept='.zip,.rar,.7zip' />
        </Button>
        {userFiles.map(file => {
          const attachedToListings = userListings.filter(listing => listing.fileIds.includes(file.id));
          return (
            <FileCard key={file.id} file={file} setOpenModal={setOpenModal} attachedToListings={attachedToListings} />
          );
        })}
      </div>
    )
  );
};

export default FileList;
