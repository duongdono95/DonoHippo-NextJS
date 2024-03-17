'use client';
import SideBar from '@/app/products/[userId]/_components/SideBar';
import React from 'react';
import ProductCreateNew from './ProductCreateNew';
import ProductList from './ProductList';
import { Image, Listing } from '@prisma/client';
import { menuItemType, productPageStore } from './store-product-page';

export const menuList: menuItemType[] = ['Products', 'Create New', 'Media', 'Files', 'Orders'];

interface Props {
  userId: string;
  products: ({
    images: Image[];
  } & Listing)[];
}
const ProductPageContent = ({ userId, products }: Props) => {
  const { active } = productPageStore();
  return (
    <div className='flex h-full'>
      <SideBar />

      <div className={'flex-1'}>
        {active === 'Create New' ? <ProductCreateNew userId={userId} /> : null}
        {active === 'Products' ? <ProductList userId={userId} products={products} /> : null}
      </div>
    </div>
  );
};

export default ProductPageContent;
