import WrapperFullWidth from '@/components/WrapperFullWidth';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';
import ProductPageContent from './_components/ProductPageContent';
import { db } from '@/libs/db';
import { auth } from '@clerk/nextjs';

interface Props {
  params: {
    userId: string;
  };
}

const ProductPage = async ({ params }: Props) => {
  const { userId } = params;
  return (
    <WrapperFullWidth>
      <ProductPageContent userId={userId} />
    </WrapperFullWidth>
  );
};

export default ProductPage;
