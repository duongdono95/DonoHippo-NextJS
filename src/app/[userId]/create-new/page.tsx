import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';
import ProductCreateNew from './_components/ProductCreateNew';

const page = () => {
  const user = auth();
  if (!user.userId) {
    redirect('/sign-in');
  }
  return <ProductCreateNew userId={user.userId} />;
};

export default page;
