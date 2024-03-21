import React from 'react';
import FileList from './_components/FileList';
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
  const userFiles = await db.fileInterface.findMany({
    where: {
      userId: user.userId,
    },
  });
  return (
    <div>
      <FileList userId={user.userId} userFiles={userFiles} userListings={userListings} />
    </div>
  );
};

export default page;
