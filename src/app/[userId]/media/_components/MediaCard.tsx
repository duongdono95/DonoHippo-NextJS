'use client';

import { IconButton, Modal, Tooltip } from '@mui/material';
import { ImageInterface, ListingInterface } from '@prisma/client';
import { ContactRound, Trash2Icon, Link2Off } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { ModalStateT } from './MediaList';
interface Props {
  image: ImageInterface;
  attachedToListings: ListingInterface[];
  setOpenModal: React.Dispatch<React.SetStateAction<ModalStateT>>;
}
const MediaCard = ({ image, setOpenModal, attachedToListings }: Props) => {
  return (
    <div className='w-40 p-4 h-60 cursor-pointer hover:scale-105 bg-slate-100 shadow-md rounded-md'>
      <div className='relative w-32 h-32 rounded-md overflow-hidden '>
        <Image fill src={image.imageUrl} alt={image.name} />
      </div>
      <p className='truncate py-4 font-medium opacity-80'>{image.name}</p>
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
                              image: image,
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
              image: image,
              listing: null,
              type: 'deleteImage',
            })
          }
        >
          <Trash2Icon size={20} color='red' opacity={0.5} />
        </IconButton>
      </div>
    </div>
  );
};

export default MediaCard;
