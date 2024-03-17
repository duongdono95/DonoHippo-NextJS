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
  const products = await db.listing.findMany({
    where: {
      userId: userId,
    },
    include: {
      images: true,
      files: true,
    },
  });
  if (!userId) {
    redirect('/sign-in');
  }
  return (
    <WrapperFullWidth>
      <ProductPageContent userId={userId} products={products} />
    </WrapperFullWidth>
  );
};

export default ProductPage;
