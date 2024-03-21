import React from 'react';
import MediaList from './_components/MediaList';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { db } from '@/libs/db';

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
  const userImages = await db.imageInterface.findMany({
    where: {
      userId: user.userId,
    },
  });
  return <MediaList userId={user.userId} userImages={userImages} userListings={userListings} />;
};

export default page;
