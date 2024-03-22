import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';
import ProductCreateNew from './_components/ProductCreateNew';
import LoadingPage from '@/components/LoadingPage';

const page = () => {
  const user = auth();
  if (!user.userId) {
    redirect('/sign-in');
  }
  return (
    <Suspense key={user.userId} fallback={<LoadingPage />}>
      <ProductCreateNew userId={user.userId} />
    </Suspense>
  );
};

export default page;
