'use client';
import WrapperFullWidth from '@/components/WrapperFullWidth';
import React, { useState } from 'react';
import { productPageStore } from './_components/store-product-page';
import SideBar from './_components/SideBar';
import ProductCreateNew from './_components/ProductCreateNew';
import ProductList from './_components/ProductList';
import MediaList from './_components/MediaList';
interface Props {
  params: {
    userId: string;
  };
}

const ProductPage = ({ params }: Props) => {
  const { userId } = params;
  const { active } = productPageStore();
  return (
    <WrapperFullWidth>
      <div className='flex h-full'>
        <SideBar />
        <div className={'flex-1'}>
          {active === 'Create New' ? <ProductCreateNew userId={userId} /> : null}
          {active === 'Products' ? <ProductList userId={userId} /> : null}
          {active === 'Media' ? <MediaList userId={userId} /> : null}
        </div>
      </div>
    </WrapperFullWidth>
  );
};

export default ProductPage;
