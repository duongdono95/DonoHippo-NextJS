'use client';

import { IconButton, Tooltip } from '@mui/material';
import { FileInterface, ListingInterface } from '@prisma/client';
import { ContactRound, File, Link2Off, Trash2Icon } from 'lucide-react';
import React from 'react';
import { ModalStateT } from './FileList';

interface Props {
  file: FileInterface;
  attachedToListings: ListingInterface[];
  setOpenModal: React.Dispatch<React.SetStateAction<ModalStateT>>;
}
const FileCard = ({ file, setOpenModal, attachedToListings }: Props) => {
  return (
    <div className='w-40 p-4 h-60 cursor-pointer hover:scale-105 bg-slate-100 shadow-md rounded-md'>
      <div className=' w-32 h-32 rounded-md overflow-hidden bg-slate-200 p-2'>
        <File size={30} />
      </div>
      <p className='truncate py-4 font-medium opacity-80'>{file.name}</p>
      <div className='flex items-center justify-between'>
        <Tooltip
          placement='right'
          title={
            attachedToListings.length > 0 ? (
              <div className='flex flex-col '>
                {attachedToListings.map((listing, index) => (
                  <div className='w-40 ' key={index}>
                    <p
                      style={{
                        fontSize: 10,
                        opacity: 0.7,
                        paddingTop: '5px',
                        borderBottom: '1px solid var(--white05)',
                      }}
                    >
                      Attaching To:
                    </p>
                    <div className='w-full truncate flex justify-between items-center'>
                      <p className='text-sm truncate select-none'>{`${index + 1}. ${listing.name}`}</p>
                      <IconButton>
                        <Tooltip
                          title={'Detach The image'}
                          onClick={() =>
                            setOpenModal({
                              open: true,
                              file: file,
                              listing: listing,
                              type: 'deleteAttachment',
                            })
                          }
                        >
                          <Link2Off size={16} color='white' />
                        </Tooltip>
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            ) : null
          }
        >
          <div className='flex items-center'>
            <ContactRound size={20} />
            <p className='pl-1'>{attachedToListings.length}</p>
          </div>
        </Tooltip>
        <IconButton
          onClick={() =>
            setOpenModal({
              open: true,
              file: file,
              listing: null,
              type: 'deleteFile',
            })
          }
        >
          <Trash2Icon size={20} color='red' opacity={0.5} />
        </IconButton>
      </div>
    </div>
  );
};

export default FileCard;
