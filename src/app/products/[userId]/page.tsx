'use client';
import WrapperFullWidth from '@/components/WrapperFullWidth';
import React, { useState } from 'react';
import { productPageStore } from './_components/store-product-page';
import SideBar from './_components/SideBar';
import ProductCreateNew from './_components/ProductCreateNew';
import ProductList from './_components/ProductList';
import MediaList from './_components/MediaList';
import { useQuery } from '@tanstack/react-query';
import { FileInterface, ImageInterface, ListingInterface } from '@prisma/client';
import { fetcher } from '@/hooks/fetcher';
import FileList from './_components/FileList';
interface Props {
  params: {
    userId: string;
  };
}

const ProductPage = ({ params }: Props) => {
  const { userId } = params;
  const { active } = productPageStore();
  const { data: userImages } = useQuery<ImageInterface[]>({
    queryKey: ['images'],
    queryFn: () => fetcher(`/api/media/${userId}`),
  });
  const { data: userFiles } = useQuery<FileInterface[]>({
    queryKey: ['files'],
    queryFn: () => fetcher(`/api/files/${userId}`),
  });
  const { data: userListings, isLoading } = useQuery<ListingInterface[]>({
    queryKey: ['listings'],
    queryFn: () => fetcher(`/api/listings/${userId}`),
  });
  return (
    <WrapperFullWidth>
      <div className='flex h-full'>
        <SideBar />
        <div className={'flex-1'}>
          {active === 'Create New' ? <ProductCreateNew userId={userId} /> : null}
          {active === 'Products' ? (
            <ProductList userId={userId} userListings={userListings} userFiles={userFiles} userImages={userImages} />
          ) : null}
          {active === 'Media' ? (
            <MediaList userId={userId} userImages={userImages} userListings={userListings} />
          ) : null}
          {active === 'Files' ? <FileList userId={userId} userFiles={userFiles} userListings={userListings} /> : null}
        </div>
      </div>
    </WrapperFullWidth>
  );
};

export default ProductPage;
