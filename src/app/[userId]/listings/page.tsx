import React, { Suspense } from 'react';
import ProductList from './_components/ProductList';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { db } from '@/libs/db';
import LoadingPage from '@/components/LoadingPage';

const page = async () => {
  const user = auth();
  if (!user.userId) {
    redirect('/sign-in');
  }
  const userListings = await db.listingInterface.findMany({
    where: {
      userId: user.userId,
    },
  });
  const userFiles = await db.fileInterface.findMany({
    where: {
      userId: user.userId,
    },
  });
  const userImages = await db.imageInterface.findMany({
    where: {
      userId: user.userId,
    },
  });

  return (
    <Suspense key={user.userId} fallback={<LoadingPage />}>
      <ProductList userId={user.userId} userListings={userListings} userFiles={userFiles} userImages={userImages} />
    </Suspense>
  );
};

export default page;
